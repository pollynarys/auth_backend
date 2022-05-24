module.exports = class UserDto {
    email
    id
    role
    is_activated

    constructor(model) {
        this.email = model.email
        this.id = model.id
        this.role = model.role
        this.is_activated = model.is_activated
    }
}
