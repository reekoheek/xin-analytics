import xin from 'xin';

class XinAnalytics extends xin.Component {
  static load () {
    if (XinAnalytics.loaded) {
      return;
    }

    /* eslint-disable */
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
    /* eslint-enable */

    XinAnalytics.loaded = true;
  }

  get props () {
    return {
      trackerId: {
        type: String,
        required: true,
      },
    };
  }

  attached () {
    if (typeof window.cordova === 'undefined' || window.cordova.platformId === 'browser') {
      this.isCordova = false;

      XinAnalytics.load();

      this.startPageTracking();
      return;
    }

    this.isCordova = true;
    document.addEventListener('deviceready', () => {
      if (window.analytics) {
        this.startPageTracking();
      }
    }, true);
  }

  startPageTracking () {
    if (this.isCordova) {
      window.analytics.startTrackerWithId(this.trackerId);
      window.analytics.trackView(window.location.href);
    } else {
      window.ga('create', this.trackerId, 'none');
      this.__app.on('navigated', evt => {
        window.ga('send', 'pageview', evt.detail.uri);
      });
    }
  }

  sendEvent (category, action, label, value) {
    window.ga('send', 'event', {
      eventCategory: category,
      eventAction: action,
      eventLabel: label,
      eventValue: value,
    });
  }
}

xin.define('xin-analytics', XinAnalytics);

export default XinAnalytics;
