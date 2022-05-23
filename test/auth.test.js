import axios from 'axios';
import * as process from 'process';

const host = process.env.HOST || 'localhost'
const port = process.env.PORT
const apiUrl = `http://${host}:${port}/api`

describe('auth tests', () => {
    it('should be login', async () => {
        let response = await axios.post(`${apiUrl}/auth/login`, {
            email: "polina.vdovina@exyte.com",
            password: "qwerty"
        })
        const [data] = response.data
        console.log(data)
    })

    it('should be auth ', async () => {
        let response = await axios.post(`${apiUrl}/user/create_user`, {
            username: "polina",
            password: "qwerty",
            email: "polina.vdovina@exyte.com"
        })
        const [data] = response.data
        console.log(data)
    })

    it('should be get user ', async () => {
        let response = await axios.get(`${apiUrl}/user/1/get_user`)
        const [data] = response.data
        console.log(data)
    })

    it('should not be get users for not auth user', async () => {
        let response = await axios.get(`${apiUrl}/user/get_users`)
        const [data] = response.data
        console.log(data)
    })

    it('should be get users', async () => {
        await axios.post(`${apiUrl}/user/create_user`, {
            username: "polina",
            password: "qwerty",
            email: "polina.vdovina@exyte.com"
        })

        let response = await axios.get(`${apiUrl}/user/get_users`)
        const [data] = response.data
        console.log(data)
    })
})
