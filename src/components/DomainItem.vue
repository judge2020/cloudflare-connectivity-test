<template>
  <div>
    <p class="heading" v-text="hostname" />
    <div v-if="finished">
      <p class="title" v-text="datacenter" />
      <p class="heading" v-text="airport" />

      <p class="heading">First ping: {{ firstPing }}</p>
      <p class="heading">Second ping: {{ secondPing }}</p>
    </div>
    <div v-if="broken">
      <p>Likely not a Cloudflare website, or not proxied</p>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import Axios from "axios";
@Component
export default class DomainItem extends Vue {
  // @ts-ignore
  @Prop(String) readonly hostname: string;
  finished = false;
  broken = false;
  datacenter = "";
  airport = "";
  firstPing = 0;
  secondPing = 0;
  mounted() {
    this.loadHostname(this.hostname)
      .then(datacenter => {
        this.datacenter = datacenter;
        // @ts-ignore
        this.airport = this.$parent.getAirport(datacenter);
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
  loadHostname(hostname: string, loadNumber = 0): Promise<string> {
    return Axios.get(
      `https://${hostname}/cdn-cgi/trace?load=${loadNumber}`
    ).then(response => {
      return response.data
        .split("\n")
        .map((n: string) => n.split("="))
        .filter((element: string[]) => element[0] == "colo")[0][1];
    });
  }
}
</script>