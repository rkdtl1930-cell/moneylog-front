export default class Transaction{
  constructor(mid, category, amount, type, date, memo, createTime, id){
    this.mid = mid,
    this.category = category,
    this.amount = amount,
    this.type = type,
    this.date = date,
    this.memo = memo,
    this.createTime = createTime,
    this.id = id
  }
}