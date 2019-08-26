<template>
  <div class="main-content">
    <div class="container has-text-centered">
      <h1 class="title">Cloudflare datacenter reachability</h1>
      <h2 class="subtitle"></h2>
      <br />
      <p class="subtitle">Test your website:</p>
      <form @submit="loadTestHostname(testHostname)">
        <div class="field has-addons has-addons-centered">
          <div class="control">
            <input
              class="input"
              type="text"
              placeholder="example.com"
              v-model="testHostname"
              @blur="loadTestHostname(testHostname)"
            />
          </div>
          <div class="control">
            <a class="button is-info">GO</a>
          </div>
        </div>
      </form>

      <div class="domain-item" v-if="testHostname">
        <p class="heading" v-text="testHostname" />
        <div v-if="testHostname in finished">
          <p class="title" v-text="finished[testHostname]" />
          <p class="heading" v-text="iata[finished[testHostname]]" />
        </div>
        <p v-show="testHostname in broken">Likely not a Cloudflare website!</p>
      </div>
      <hr />
    </div>
    <hr class="top-hr" />
    <div class="columns has-text-centered">
      <div class="column">
        <p class="title">FREE</p>
        <div class="domain-item" v-for="(site, index) in free" :key="index">
          <p class="heading" v-text="site" />
          <div v-if="site in finished">
            <p class="title" v-text="finished[site]" />
            <p class="heading" v-text="iata[finished[site]]" />
            <p class="heading">First ping: {{ timingsFirst[site] }}</p>
            <p class="heading">Second ping: {{ timingsSecond[site] }}</p>
          </div>
          <hr />
        </div>
      </div>
      <div class="column list-domains">
        <p class="title">PRO</p>
        <div class="domain-item" v-for="(site, index) in pro" :key="index">
          <p class="heading" v-text="site" />
          <div v-if="site in finished">
            <p class="title" v-text="finished[site]" />
            <p class="heading" v-text="iata[finished[site]]" />
            <p class="heading">First ping: {{ timingsFirst[site] }}</p>
            <p class="heading">Second ping: {{ timingsSecond[site] }}</p>
          </div>
          <hr />
        </div>
      </div>
      <div class="column list-domains">
        <p class="title">BUSINESS</p>
        <div class="domain-item" v-for="(site, index) in business" :key="index">
          <p class="heading" v-text="site" />
          <div v-if="site in finished">
            <p class="title" v-text="finished[site]" />
            <p class="heading" v-text="iata[finished[site]]" />
            <p class="heading">First ping: {{ timingsFirst[site] }}</p>
            <p class="heading">Second ping: {{ timingsSecond[site] }}</p>
          </div>
          <hr />
        </div>
      </div>
      <div class="column list-domains">
        <p class="title">ENTERPRISE</p>
        <div class="domain-item" v-for="(site, index) in enterprise" :key="index">
          <p class="heading" v-text="site" />
          <div v-if="site in finished">
            <p class="title" v-text="finished[site]" />
            <p class="heading" v-text="iata[finished[site]]" />

            <p class="heading">First ping: {{ timingsFirst[site] }}</p>
            <p class="heading">Second ping: {{ timingsSecond[site] }}</p>
          </div>
          <hr />
        </div>
      </div>
    </div>
    <section class="hero">
      <div class="hero-body">
        <div class="container">
          <h1 class="title"></h1>
          <h2 class="subtitle">Note: the plan these websites are on is an educated guess.</h2>
          <p>
            Pro websites were taken from the
            <a
              href="https://developers.cloudflare.com/sponsorships/"
            >Open Source sponsorships page</a>, Business from the
            <a href="https://www.cloudflare.com/galileo/">Project Galileo page</a>, and Enterprise from the
            <a
              href="https://www.cloudflare.com/case-studies/"
            >Case Studies page</a>.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import Vue from "vue";
import Axios from "axios";
import { setTimeout } from "timers";
export default {
  name: "Main",
  props: {},
  data() {
    return {
      testHostname: "",
      iata: [],
      timingsFirst: [],
      timingsSecond: [],
      finished: [],
      broken: [],
      free: [
        "judge2020.com",
        "domjh.net",
        "digital.com",
        "firing.it",
        "www.shoutmeloud.com",
        "judge2020.me",
        "cloudeereviews.com"
      ],
      pro: [
        "js.org",
        "git-scm.com",
        "nodejs.org",
        "cdnjs.com",
        "getbootstrap.com",
        "reactjs.org",
        "html5boilerplate.com",
        "yarnpkg.com",
        "d3js.org"
      ],
      business: [
        "judge.sh",
        "www.mozilla.org",
        "domjh.com",
        "manfredi.io",
        "corporateclash.net",
        "sontusdatos.org",
        "www.opentech.fund",
        "cpj.org",
        "www.amnestyusa.org",
        "cdt.org",
        "www.counterextremism.com",
        "www.ndi.org",
        "www.findlaw.com",
        "www.codeguard.com",
        "www.techagainstterrorism.org",
        "www.thetrevorproject.org"
      ],
      enterprise: [
        "cloudflare.com",
        "cdnjs.cloudflare.com",
        "medium.com",
        "discordapp.com",
        "www.zendesk.com",
        "ghost.io",
        "unpkg.com",
        "www.loc.gov",
        "www.artstation.com",
        "www.digitalocean.com",
        "quizlet.com",
        "i.gyazo.com"
      ]
    };
  },
  mounted() {
    this.preloadAirports();
    this.free
      .concat(this.pro, this.business, this.enterprise)
      .forEach(hostname => {
        this.loadHostname(hostname, 0).then(() => this.loadHostname(hostname, 1));
      });

    // load query string hostname
    if (location.hash) {
      this.testHostname = location.hash.replace("#", "");
      this.loadTestHostname(this.testHostname);
      this.$forceUpdate();
    }
    setTimeout(() => {
      this.loadPing(0)
      this.loadPing(1)
    }, 1500);
  },
  methods: {
    loadPing(loadNumber = 0) {
      performance.getEntriesByType("resource")
        .filter(timing => timing.name.includes(`load=${loadNumber}`))
        .forEach(timing => {
          if (loadNumber == 0) {
            this.timingsFirst[new URL(timing.name).hostname] = Math.floor(timing.responseEnd - timing.startTime);
          } else {
            this.timingsSecond[new URL(timing.name).hostname] = Math.floor(timing.responseEnd - timing.startTime);
          }
        });
      this.$forceUpdate();
    },
    preloadAirports() {
      Axios.get("/iata.json").then(response => {
        this.iata = response.data;
      });
    },
    loadTestHostname(hostname) {
      history.replaceState(
        "",
        "",
        hostname.includes("#") ? hostname : "#" + hostname
      );
      this.loadHostname(hostname);
    },
    loadHostname(hostname, loadNumber = 0) {
      return Axios.get(`https://${hostname}/cdn-cgi/trace?load=${loadNumber}`)
        .then(response => {
          response.data
            .split("\n")
            .map(n => n.split("="))
            .forEach(element => {
              if (element[0] == "colo") {
                Vue.set(this.finished, hostname, element[1]);
              }
            });
        });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.domain-item {
  margin-top: 2rem;
  margin-bottom: 2rem;
}
.top-hr {
  position: relative;
  bottom: -5rem;
}
.main-content {
  padding: 1.5rem;
  line-height: 1rem;
}
</style>
