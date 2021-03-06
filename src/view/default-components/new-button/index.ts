import Vue from "vue";
import Component from "vue-class-component";
import * as WithRender from "./template.html";
require("./styles.scss");
const addIcon = require("assets/add.svg");

@WithRender
@Component({
  props: {
    click: Function,
    tooltipText: String,
    tooltipPosition: String,
  },
})
export default class ButtonComponent extends Vue {
  public addIcon: string = addIcon;
  private tText: string = "";
  private tPos: string = "";

  public mounted() {
    this.tText = this.$props.tooltipText;
    this.tPos = this.$props.tooltipPosition;
  }

  public onclick(): void {
    this.$props.click();
  }
}
