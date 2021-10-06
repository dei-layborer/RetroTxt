// filename: sw/tabs.js
//
/*global Developer Configuration Security Extension Downloads LocalStore CheckError Firefox WebBrowser */

chrome.tabs.onCreated.addListener((tab) => {
  const tabs = new Tabs()
  tabs.tabId = tab.id
  if (!(`url` in tab)) return tabs._permissionDenied(true, `created`)
  new Tab(tab.id, tab.url, tab).create()
})

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tabInfo) => {
  const tabs = new Tabs()
  tabs.tabId = tabId
  if (!(`url` in tabInfo)) {
    const consoleLog =
      `status` in changeInfo && changeInfo.status === `complete` ? true : false
    return tabs._permissionDenied(consoleLog, `updated`)
  }
  // don't run the update when the tab isn't 'active'
  if (tabInfo.active) new Tab(tabId, tabInfo.url, changeInfo).update()
})

chrome.tabs.onRemoved.addListener((tabId) => {
  new Tab(tabId).remove()
})

//
// tabs onActivated
// browser tab activated listener
chrome.tabs.onActivated.addListener((activeInfo) => {
  if (typeof activeInfo.tabId === `undefined`) return
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (
      typeof chrome.runtime.lastError === `object` &&
      chrome.runtime.lastError.message !== ``
    )
      console.log(chrome.runtime.lastError.message)
    if (typeof tab === `undefined`) return
    //new Action(tab.id, tab).activated()
  })
})

/**
 * Handle event listeners for browser tabs.
 * @class Tabs
 */
class Tabs {
  constructor() {
    this.tabId = 0
  }
  /**
   * Add event listeners for tabs.
   */
  async listen() {
    console.log(`Tabs.listen() should be removed`)
  }
  /**
   * Remove the all event listeners for tabs.
   */
  async remove() {
    chrome.tabs.onCreated.removeListener()
    chrome.tabs.onUpdated.removeListener()
    chrome.tabs.onRemoved.removeListener()
  }
  /**
   * API access permission has been denied by the browser.
   */
  _permissionDenied(consoleLog = false, listener = ``) {
    if (consoleLog !== true) return
    chrome.storage.local.get(Developer, (store) => {
      if (Developer in store)
        console.log(
          `⚠ Permission denied, cannot read the URL of %s tab #${this.tabId}.`,
          listener
        )
    })
  }
}

/**
 * Handle events for an individual browser tab.
 * @class Tab
 */
class Tab {
  /**
   * Creates an instance of Tab.
   * @param [id=0] Id of the tab
   * @param [url=``] URL of the tab
   * @param [info={}] Tab object
   * @param [menuId=``] Id of the context menus to modify
   */
  constructor(id = 0, url = ``, info = {}, menuId = ``) {
    this.id = id
    this.info = info
    this.menuId = menuId
    this.url = url
  }
  /**
   * Checks to the URL's filename and then check the tab's content to make sure
   * it's compatible with RetroTxt.
   * Intended to be run in conjunction with `this._checkURL()`.
   */
  compatibleURL() {
    console.log(`Tabs.compatibleURL() has been requested.`)
    const config = new Configuration()
    // fetch() method initialize object
    // https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch
    const fetchInit = { method: `GET`, cache: `default` }
    // tab object
    const tab = {
      menuId: this.menuId,
      tabid: this.id,
      url: this.url,
    }
    // URI object with a domain, a skip Boolean and scheme (https|file)
    const uri = {
      domain: this._hostname(),
      ignore: !config.validateFilename(this.url),
      scheme: this.url.split(`:`)[0],
    }
    // check against the hard coded black list of domains & schemes to skip any
    // false positives or conflicts
    if (config.validateDomain(uri.domain))
      return console.warn(
        `RetroTxt conflicts with the domain %s so %s is ignored.`,
        uri.domain,
        this.url
      )
    const files = new Security(`files`)
    switch (uri.scheme) {
      // note there is a `URI` object and `URL` string
      case `file`:
        if (this._ignoreDir()) return
        if (this._ignoreURL(uri.ignore)) return
        if (this._ignoreEdgecase()) return
        console.info(`Loading local file ${this.url}.`)
        return chrome.permissions.contains(files.test(), (result) => {
          result === true
            ? new Extension().activateTab(null, tab)
            : files.fail()
        })
      case `http`:
      case `https`:
        // use Fetch API to download tab
        return fetch(this.url, fetchInit)
          .then((response) => {
            if (response.ok) return response.blob()
            throw new Error()
          })
          .then((data) => {
            new Downloads().parseBlob(data, tab)
            chrome.storage.local.get(Developer, (store) => {
              if (Developer in store)
                console.log(`Fetch API data results.\n`, data)
            })
          })
          .catch((error) => {
            console.error(
              `Tabs.compatibleURL(${this.menuId}, ${this.url}, ${this.id}) failed: ${error}.`
            )
          })
      default:
        chrome.storage.local.get(Developer, (store) => {
          if (Developer in store)
            console.log(
              `Tab URL '%s' is not known so ignoring onClick action.`,
              this.url
            )
        })
    }
  }
  create() {
    this.menuId = `onCreated`
    chrome.tabs.query({ status: `complete` }, () => {
      const validate = () => {
        const http = new Security(`http`, this.url)
        switch (`${this.info.status}`) {
          case `complete`:
            return chrome.permissions.contains(http.test(), (result) => {
              if (result === true) return this._checkURL()
            })
          case `loading`:
            // Chrome fix:
            // when a tab is not active & tab.status is stuck at loading
            if (this.url.startsWith(`file:///`) && !this.info.active) {
              const test = new Security(`files`).test()
              chrome.permissions.contains(test, (result) => {
                if (result === true) return this._checkURL()
                this._permissionDenied(test)
              })
            }
        }
      }
      // handle file protocol
      if (this.url.startsWith(`file:///`)) {
        const test = new Security(`files`).test()
        return chrome.permissions.contains(test, (result) => {
          result === true ? validate() : this._permissionDenied(test)
        })
      }
      // handle http protocol
      return validate()
    })
  }
  remove() {
    chrome.storage.local.get(Developer, (store) => {
      if (Developer in store) console.log(`🗙 Closed tab #${this.id}.`)
    })
    const keys = Object.keys(sessionStorage)
    for (const key of keys) {
      if (key.includes(`tab${this.id}`)) sessionStorage.removeItem(key)
    }
  }
  update() {
    chrome.tabs.query(
      {
        active: true,
        lastFocusedWindow: true,
        status: `complete`,
      },
      () => {
        // `sessionStorage` clean up
        const updateCount = sessionStorage.getItem(`tab${this.id}update`)
        if (updateCount === null)
          sessionStorage.setItem(`tab${this.id}update`, 1)
        else
          sessionStorage.setItem(
            `tab${this.id}update`,
            parseInt(updateCount) + 1
          )
        if (updateCount >= 3) {
          sessionStorage.removeItem(`tab${this.id}encoding`)
          sessionStorage.removeItem(`tab${this.id}textfile`)
          sessionStorage.removeItem(`tab${this.id}update`)
        }
        // browser specific cases
        // IMPORTANT: if there are multiple instances of RetroTxt being invoked
        // within the same browser tab, then the logic in the code below is a
        // likely suspect!
        this.menuId = `onUpdated`
        if (this.info.status === `complete`) {
          // handle file protocol
          if (this.url.startsWith(`file:///`)) {
            const test = new Security(`files`).test()
            return chrome.permissions.contains(test, (result) => {
              result === true ? this._checkURL() : this._permissionDenied(test)
            })
          }
          // handle http protocol
          const test = new Security(`http`, this.url).test()
          chrome.permissions.contains(test, (result) => {
            result === true ? this._checkURL() : this._permissionDenied(test)
          })
        }
      }
    )
  }
  /**
   * Validates `this.url` and skips URL schemes and domains that are not
   * compatible with RetroTxt.
   */
  _checkURL() {
    const valid = this._validateURLSyntax()
    if (!valid)
      return console.info(
        `RetroTxt has skipped tab #%s as it points to an incompatible URL.\n%s`,
        this.id,
        this.url
      )
    // get and parse the URL
    const uri = {
      domain: this._hostname(),
      scheme: this.url.split(`:`)[0],
    }
    // Option `Run RetroTxt on files hosted on these domains`
    let domains = `${localStorage.getItem(`settingsWebsiteDomains`)}`,
      approved = false
    if (domains.length === 0) {
      chrome.storage.local.get(`settingsWebsiteDomains`, (result) => {
        const value = `${result.settingsWebsiteDomains}`
        if (value.length < 1) {
          new LocalStore().scan()
          return CheckError(
            `Could not obtain the required settingsWebsiteDomains setting requested by eventUrl().`,
            false
          )
        }
        localStorage.setItem(`settingsWebsiteDomains`, value)
      })
      domains = `${localStorage.getItem(`settingsWebsiteDomains`)}`
      if (domains.length === 0) {
        // redundancy in case localStorage doesn't work
        domains = new Extension().defaults.get(`settingsWebsiteDomains`)
      }
    }
    // insert the RetroTxt URL into the approved list
    // see `_locales/en_US/messages.json` URL for the http address
    domains = `${chrome.i18n.getMessage(`url`)};${domains}`
    // list of approved website domains
    approved = domains.includes(uri.domain)
    // if the URL domain is not apart of the user approved list then RetroTxt is
    // aborted for the tab
    if (uri.scheme !== `file` && approved !== true) return
    // if the URL domain is apart of the user approved list then we then test
    // the filename or body content
    this.compatibleURL()
  }
  /**
   * Returns a URL without any sub-domains, ports or schemes.
   * For example `https://www.example.com:9000` will return `example.com`.
   */
  _hostname() {
    if (this.url === ``) return ``
    var url = ``
    try {
      const u = new URL(`${this.url}`)
      url = u.hostname
    } catch (e) {
      url = this.url
    }
    let host = url.split(`/`)[2]
    if (typeof host === `undefined`) host = url
    const parts = host.split(`.`)
    if (parts.length <= 2) return host
    // drop the sub-domain
    parts.shift()
    // convert the array back to a string
    return parts.join(`.`)
  }
  _ignoreDir() {
    const directory = `/`
    if (this.url.substring(this.url.length - 1) === directory) {
      chrome.storage.local.get(Developer, (store) => {
        if (Developer in store)
          console.log(
            `Directory detected so ignoring tab #%s.\n%s`,
            this.id,
            this.url
          )
      })
      return true
    }
    return false
  }
  _ignoreURL(ignore = false) {
    // compare the filename extension to the ignore list
    if (ignore === true) {
      chrome.storage.local.get(Developer, (store) => {
        // compare the filename extension to the ignore list
        if (Developer in store)
          console.log(
            `Invalid filename extension detected so ignoring tab #%s.\n%s`,
            this.id,
            this.url
          )
      })
      return true
    }
    return false
  }
  _ignoreEdgecase() {
    if (WebBrowser() === Firefox) {
      // look for filenames with extensions
      const path = this.url.split(`/`).slice(-1)
      // otherwise assume it's a directory
      if (path.toString().indexOf(`.`) < 0) {
        chrome.storage.local.get(Developer, (store) => {
          // compare the filename extension to the ignore list
          if (Developer in store)
            console.log(
              `Directory detected so ignoring tab #%s.\n%s`,
              this.id,
              this.url
            )
        })
        return true
      }
      return false
    }
  }
  /**
   * API permission access has been denied by the browser.
   * @param [result={}] Permission test object that was denied
   */
  _permissionDenied(result = {}) {
    chrome.storage.local.get(Developer, (store) => {
      // compare the filename extension to the ignore list
      if (Developer in store)
        console.trace(`⚠ Permission denied for the following request\n`, result)
    })
  }
  /**
   * Checks the URL compatibility with RetroTxt.
   * @returns boolean
   */
  _validateURLSyntax() {
    if (this.url.length < 1) return false
    // NOTE: There is a strange bug in Firefox that is not replicable,
    // that tries to parse about:blank but results in a permission denied loop.
    if (this.url.startsWith(`https://`)) return true
    if (this.url.startsWith(`http://`)) return true
    if (this.url.startsWith(`file:///`)) return true
    return false
  }
}