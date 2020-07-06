import {
    USER_LOGGED_OUT,
    USER_LOGGED_IN,
    LOADING_USER,
    USER_LOADED,
} from "./actionTypes";
import axios from 'axios'
import { setMessage } from './message'

const authBaseURL = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty'
// Essa chave é encontrada nas configurações do projeto no Firebase (Chave de API da Web)
const API_KEY = 'AIzaSyDfdKbFKHAB8I__jdBJAMIwrsoXhCzRepU'

export const userLogeged = user => {
    return {
        type: USER_LOGGED_IN,
        payload: user
    }
}

export const logout = () => {
    return {
        type: USER_LOGGED_OUT
    }
}

export const createUser = user => {
    return dispatch => {
        dispatch(loadingUser())
        // persiste as informações que estão vindo do Register.js
        axios.post(`${authBaseURL}/signupNewUser?key=${API_KEY}`, {
            email: user.email,
            password: user.password,
            returnSecureToken: true
        })
            .catch(err =>
                dispatch(setMessage({
                    title: 'Erro',
                    text: 'Erro ao criar usuário :('
                }))
            )
            // epois de criar o usuário e retornar OK, 
            // persiste as informações adicionais do usuario
            .then(res => {
                // se o usuario ja existir faz um PUT
                if (res.data.localId) {
                    axios.put(`/users/${res.data.localId}.json`, {
                        // Adicionar aqui os campos extras não previstos na autenticação do Firebase
                        name: user.name
                    })
                        .catch(err =>
                            dispatch(setMessage({
                                title: 'Erro',
                                text: 'Erro ao ientificar o banco de dados :('
                            }))
                        )
                        .then(res => {
                            delete user.password
                            user.id = res.data.localId
                            dispatch(userLogeged(user))
                            dispatch(userLoaded())
                        })
                }


            })

    }
}

export const loadingUser = () => {
    return {
        type: LOADING_USER
    }
}

export const userLoaded = () => {
    return {
        type: USER_LOADED
    }
}

export const login = user => {
    return dispatch => {
        dispatch(loadingUser())
        axios.post(`${authBaseURL}/verifyPassword?key=${API_KEY}`, {
            email: user.email,
            password: user.password,
            returnSecureToken: true
        })
            .catch(err =>
                dispatch(setMessage({
                    title: 'Erro',
                    text: 'Ocorreu um erro inesperado! :('
                }))
            )
            .then(res => {
                if (res.data.localId) {
                    axios.get(`/users/${res.data.localId}.json`)
                        .catch(err =>
                            dispatch(setMessage({
                                title: 'Erro',
                                text: 'Ocorreu um erro inesperado! :('
                            }))
                        )
                        .then(res => {
                            delete user.password
                            user.name = res.data.name
                            dispatch(userLogeged(user))
                            dispatch(userLoaded())
                        })
                }
            })
    }
}