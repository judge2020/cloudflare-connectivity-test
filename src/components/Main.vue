<template>
  <div class="main-content">
    <div class="container has-text-centered">
      <h1 class="title">Cloudflare datacenter reachability</h1>

      <h2 class="subtitle">
        <a
          target="_blank"
          href="https://github.com/judge2020/cloudflare-connectivity-test/wiki/Explanation"
        >Explanation</a>
      </h2>
      <p class="subtitle">Test your website:</p>
      <form @submit.prevent="loadTestHostname(testHostname)">
        <div class="field has-addons has-addons-centered">
          <div class="control">
            <input class="input" type="text" placeholder="example.com" v-model="testHostname" />
          </div>
          <div class="control">
            <a class="button is-info">GO</a>
          </div>
        </div>
      </form>

      <div class="domain-item" v-if="testHostname" :key="testHostname">
        <domain-item :hostname="testHostname" />
      </div>
      <hr />
    </div>
    <hr class="top-hr" />
    <div class="columns has-text-centered" v-if="preloaded">
      <div class="column">
        <p class="title">FREE</p>
        <div class="domain-item" v-for="(site, index) in free" :key="index">
          <domain-item :hostname="site" />
          <hr />
        </div>
      </div>
      <div class="column list-domains">
        <p class="title">PRO</p>
        <div class="domain-item" v-for="(site, index) in pro" :key="index">
          <domain-item :hostname="site" />
          <hr />
        </div>
      </div>
      <div class="column list-domains">
        <p class="title">BUSINESS</p>
        <div class="domain-item" v-for="(site, index) in business" :key="index">
          <domain-item :hostname="site" />
          <hr />
        </div>
      </div>
      <div class="column list-domains">
        <p class="title">ENTERPRISE</p>
        <div class="domain-item" v-for="(site, index) in enterprise" :key="index">
          <domain-item :hostname="site" />
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
import { Vue, Component, Prop, Model } from "vue-property-decorator";
import Axios from "axios";
import DomainItem from "./DomainItem";
@Component({
  components: {
    DomainItem
  }
})
export default class Main extends Vue {
  @Model({ type: String }) testHostname;
  preloaded = false;
  iata = [];
  free = [
    "judge2020.com",
    "domjh.net",
    "digital.com",
    "firing.it",
    "www.shoutmeloud.com",
    "judge2020.me",
    "cloudeereviews.com"
  ];
  pro = [
    "js.org",
    "git-scm.com",
    "nodejs.org",
    "cdnjs.com",
    "getbootstrap.com",
    "reactjs.org",
    "html5boilerplate.com",
    "yarnpkg.com",
    "d3js.org"
  ];
  business = [
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
  ];
  enterprise = [
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
  ];
  mounted() {
    this.preloadAirports().then(() => {
      this.preloaded = true;
    });
    // load query string hostname
    if (location.hash) {
      this.testHostname = location.hash.replace("#", "");
      this.loadTestHostname(this.testHostname);
      this.$forceUpdate();
    }
  }
  loadTestHostname() {
    this.$forceUpdate();
  }
  getAirport(code) {
    return this.iata[code];
  }
  preloadAirports() {
    return Axios.get("/iata.json").then(response => {
      this.iata = response.data;
    });
  }
}
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
