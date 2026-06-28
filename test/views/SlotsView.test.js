import { mount } from "@vue/test-utils";
import SlotsView from "../../src/views/SlotsView.vue";

const selectedBet = 10000;

describe("mount component, spin with selected value, calculate rewards", async () => {
  expect(SlotsView).toBeTruthy();

  const wrapper = mount(SlotsView, {
    props: {
      points: selectedBet,
    },
  });

  test("spin with selectedValue", async () => {
    await wrapper.find("#betSelect").setValue(selectedBet);

    await wrapper.vm.spinSlots(1);

    expect(wrapper.emitted().changePoints[0][0]).toBe(-selectedBet);
  });

  test("calculate rewards", async () => {
    // Reference the component's actual payout constants so this test stays
    // correct even when payouts are tuned for a different RTP / house edge.
    const { payout777, payoutTwoSame, payoutTripleDollar } = wrapper.vm;

    await wrapper.vm.calculateReward(["7", "7", "7"]);
    expect(wrapper.emitted().changePoints[1][0]).toBe(selectedBet * payout777);

    await wrapper.vm.calculateReward(["=", "7", "="]);
    expect(wrapper.emitted().changePoints[2][0]).toBe(
      selectedBet * payoutTwoSame
    );

    await wrapper.vm.calculateReward(["$", "$", "$"]);
    expect(wrapper.emitted().changePoints[3][0]).toBe(
      selectedBet * payoutTripleDollar
    );
  });
});
