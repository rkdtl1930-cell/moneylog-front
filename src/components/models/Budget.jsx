export default class Budget{
  constructor(mid, month, year, limitAmount, usedAmount, createTime, id){
    this.mid = mid;
    this.month = month;
    this.year = year;
    this.limitAmount = limitAmount;
    this.usedAmount = usedAmount;
    this.createTime = createTime;
    this.id = id;
  }
  updageLimitAmount(newLimit){
    this.limitAmount = newLimit
  }
  addUsedAmount(amount){
    this.usedAmount += amount
  }
  minusUsedAmount(amount){
    this.usedAmount -= amount
  }
}