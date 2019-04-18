<template>
  <div class="main-content">
    <section class="hero">
      <div class="hero-body">
        <div class="container has-text-centered">
          <h1 class="title">Cloudflare datacenter reachability</h1>
          <h2 class="subtitle"></h2>
        </div>
      </div>
    </section>
    <hr class="top-hr">
    <div class="columns has-text-centered">
      <div class="column">
        <p class="title">FREE</p>
        <div class="domain-item" v-for="(site, index) in free" :key="index">
          <p class="heading" v-text="site"/>
          <p class="title" v-text="finished[site]" :aria-expanded="loadHostname(site)"/>
          <hr>
        </div>
      </div>
      <div class="column list-domains">
        <p class="title">PRO</p>
        <div class="domain-item" v-for="(site, index) in pro" :key="index">
          <p class="heading" v-text="site"/>
          <div v-show="site in finished" :aria-expanded="loadHostname(site)">
            <p class="title" v-text="finished[site]"/>
          </div>
          <hr>
        </div>
      </div>
      <div class="column list-domains">
        <p class="title">BUSINESS</p>
        <div class="domain-item" v-for="(site, index) in business" :key="index">
          <p class="heading" v-text="site"/>
          <p class="title" v-text="finished[site]" :aria-expanded="loadHostname(site)"/>
          <hr>
        </div>
      </div>
      <div class="column list-domains">
        <p class="title">ENTERPRISE</p>
        <div class="domain-item" v-for="(site, index) in enterprise" :key="index">
          <p class="heading" v-text="site"/>
          <p class="title" v-text="finished[site]" :aria-expanded="loadHostname(site)"/>
          <hr>
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
export default {
  name: "Main",
  props: {},
  data() {
    return {
      iata: [],
      finished: [],
      free: [
        "judge2020.com",
        "digital.com",
        "www.shoutmeloud.com",
        "www.cloudwards.net",
        "cloudeereviews.com"
      ],
      pro: [
        "js.org",
        "git-scm.com",
        "nodejs.org",
        "cdnjs.com",
        "getbootstrap.com",
        "reactjs.org",
        "nodejs.org",
        "html5boilerplate.com",
        "unpkg.com",
        "yarnpkg.com",
        "d3js.org",
        "www.jsdelivr.com"
      ],
      business: [
        "judge.sh",
        "www.mozilla.org",
        "sontusdatos.org",
        "www.opentech.fund",
        "cpj.org",
        "www.amnestyusa.org",
        "www.cpalanka.org",
        "cdt.org",
        "www.counterextremism.com",
        "www.ndi.org",
        "www.techagainstterrorism.org",
        "www.lionpublishers.com",
        "www.thetrevorproject.org"
      ],
      enterprise: [
        "cloudflare.com",
        "medium.com",
        "discordapp.com",
        "www.zendesk.com",
        "ghost.org",
        "www.loc.gov",
        "www.codeguard.com",
        "www.artstation.com",
        "www.findlaw.com",
        "www.digitalocean.com",
        "i.gyazo.com"
      ]
    };
  },
  mounted() {
    this.preloadAirports();
  },
  methods: {
    preloadAirports() {
      Axios.get("/iata.json").then(response => {
        this.iata = response.data;
      });
    },
    loadHostname(hostname) {
      if (this.finished[hostname]) {
        return;
      }
      Axios.get(`https://${hostname}/cdn-cgi/trace`).then(response => {
        response.data
          .split("\n")
          .map(n => n.split("="))
          .forEach(element => {
            if (element[0] == "colo") {
              Vue.set(this.finished, hostname, element[1]);
            }
          });
      });
    },
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
