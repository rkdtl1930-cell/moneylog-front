export default class Member {
  constructor(username, password, name, role, token, createTime, id){
    this.username = username
    this.password = password
    this.name = name
    this.role = role
    this.token = token
    this.createTime = createTime
    this.id = id
  }
}