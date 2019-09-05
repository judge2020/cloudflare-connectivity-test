<template>
  <div>
    <p class="heading" v-text="hostname" />
    <div v-if="finished">
      <p class="title" v-text="datacenter" />
      <p class="heading" v-text="airport" />

      <p class="heading" v-if="ipv6">IPv6</p>
      <p class="heading" v-if="!ipv6">IPv4</p>
      <p class="heading" v-text="httpVerison" />
      <p class="heading">First ping: {{ firstPing }}</p>
      <p class="heading">Second ping: {{ secondPing }}</p>
    </div>
    <div v-if="broken">
      <p>Likely not a Cloudflare website, or not proxied.</p>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import Axios from "axios";

interface TraceResponse {
  fl: string;
  h: string;
  ip: string;
  ts: number;
  visit_scheme: string;
  uag: string;
  colo: string;
  http: string;
  loc: string;
  tls: string;
  sni: string;
  warp: string;
}

@Component
export default class DomainItem extends Vue {
  // @ts-ignore
  @Prop(String) readonly hostname: string;
  finished = false
  broken = false
  datacenter = ""
  ipv6 = false
  httpVerison = ""
  airport = ""
  firstPing = 0
  secondPing = 0
  mounted() {
    this.loadHostname(this.hostname)
      .then(datacenter => {
        // detect ipv6
        this.ipv6 = datacenter.ip.includes(":");
        this.httpVerison = datacenter.http;
        this.datacenter = datacenter.colo;
        // @ts-ignore
        this.airport = this.$parent.getAirport(datacenter.colo);
      })
      .then(() => this.loadHostname(this.hostname, 1))
      .then(() => {
        this.firstPing = this.loadPing(this.hostname, 0);
        this.secondPing = this.loadPing(this.hostname, 1);
        this.finished = true;
      })
      .catch(() => {
        this.broken = true;
      });
  }

  loadPing(hostname: string, loadNumber = 0) {
    let timing = performance
      .getEntriesByType("resource")
      .filter(timing => timing.name.includes(hostname))
      .filter(timing => timing.name.includes(`load=${loadNumber}`))[0];
    // @ts-ignore
    return Math.floor(timing.responseEnd - timing.startTime);
  }
  loadHostname(hostname: string, loadNumber = 0): Promise<TraceResponse> {
    return Axios.get(
      `https://${hostname}/cdn-cgi/trace?load=${loadNumber}`
    ).then(response => {
      let resp: TraceResponse = {
        fl: "",
        h: "",
        ip: "",
        ts: 0,
        visit_scheme: "",
        uag: "",
        colo: "",
        http: "",
        loc: "",
        tls: "",
        sni: "",
        warp: ""
      };
      response.data
        .split("\n")
        .map((n: string) => n.split("="))
        .map((n: string[]) => {
          // @ts-ignore
          resp[n[0]] = n[1];
        });
      return resp;
    });
  }
}
</script>