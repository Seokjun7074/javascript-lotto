const MissionUtils = require("@woowacourse/mission-utils");
const Bonus = require("./bonus");
const Calculator = require("./Calculator");
const Lotto = require("./Lotto");
const LottoGenerator = require("./LottoGenerator");
const { INPUT_MESSAGE, OUTPUT_MESSAGE } = require("./message");
const { Console } = MissionUtils;

class App {
  constructor() {
    this.userPurchase = null;
    this.userLottos = null;
    this.winningLotto = null;
    this.bonusLotto = null;
  }

  play() {
    this.inputPrice();
  }
  inputPrice() {
    Console.readLine(INPUT_MESSAGE.PURCHASE, (payment) => {
      const lottoGenerator = new LottoGenerator();
      const myLotto = lottoGenerator.generate(payment);
      this.userLottos = myLotto;
      this.userPurchase = Number(payment);
      this.printMyLotto(myLotto);
    });
  }
  printMyLotto(myLotto) {
    Console.print(OUTPUT_MESSAGE.PURCHASE(myLotto.length));
    myLotto.forEach((lotto) => {
      lotto.sort((a, b) => a - b);
      Console.print(
        `[${lotto[0]}, ${lotto[1]}, ${lotto[2]}, ${lotto[3]}, ${lotto[4]}, ${lotto[5]}]`
      );
    });

    this.inputWinning();
  }
  inputWinning() {
    Console.readLine(INPUT_MESSAGE.WINNING, (input) => {
      const winning = input.split(",");
      this.winningLotto = new Lotto(winning).returnLotto();
      this.inputBonus();
    });
  }
  inputBonus() {
    Console.readLine(INPUT_MESSAGE.BONUS, (bonus) => {
      this.bonusLotto = new Bonus(bonus, this.winningLotto).returnBonus();
      this.calculateResult();
    });
  }
  calculateResult() {
    const result = new Calculator(
      this.userLottos,
      this.winningLotto,
      this.bonusLotto
    ).returnRank();
    this.printResult(result);
  }
  printResult(result) {
    Console.print(OUTPUT_MESSAGE.WINNING_NOTICE);
    Console.print(OUTPUT_MESSAGE.FIFTH(result.fifth));
    Console.print(OUTPUT_MESSAGE.FOURTH(result.fourth));
    Console.print(OUTPUT_MESSAGE.THIRD(result.third));
    Console.print(OUTPUT_MESSAGE.SECOND(result.second));
    Console.print(OUTPUT_MESSAGE.FIRST(result.first));
    const revenue = Calculator.calculateRevenue(result, this.userPurchase);
    Console.print(OUTPUT_MESSAGE.RESULT(revenue));
  }
}
const app = new App();
app.play();

module.exports = App;
