module.exports = class UserDto {
    email
    id
    is_activated

    constructor(model) {
        this.email = model.email
        this.id = model.id
        this.is_activated = model.is_activated
    }
}


