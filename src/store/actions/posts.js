const {
    SET_POSTS,
    ADD_COMMENT,
    CREATING_POST,
    POST_CREATED }
    = require("./actionTypes");
import { setMessage } from './message'
import axios from 'axios'

export const addPost = post => {
    return dispatch => {
        dispatch(creatingPost())
        axios({
            url: 'uploadImage',
            baseURL: 'https://us-central1-lambe-code-react.cloudfunctions.net',
            method: 'post',
            data: {
                image: post.image.base64
            }
        })
            .catch(err =>
                dispatch(setMessage({
                    title: 'Erro',
                    text: 'Ocorreu um erro inesperado! :('
                }))
            )
            .then(resp => {
                post.image = resp.data.imageUrl
                // a url base está configurada pelo axios no arquivo App.js
                // faz a persistencia no banco de dados
                axios.post('/posts.json', { ...post })
                    .catch(err =>
                        dispatch(setMessage({
                            title: 'Erro',
                            text: 'Ocorreu um erro inesperado! :('
                        })))
                    .then(res => {
                        // obtem os posts
                        dispatch(getPosts())
                        // post criado
                        dispatch(postCreated())
                        dispatch(setMessage({
                            title: 'Sucesso',
                            text: 'Postagem adicionada com sucesso!'
                        }))
                    })
            })
    }

}

export const addComment = payload => {
    return dispatch => {
        axios.get(`/posts/${payload.postId}.json`)
            .catch(err =>
                dispatch(setMessage({
                    title: 'Erro',
                    text: 'Ocorreu um erro inesperado! :('
                }))
            )
            .then(res => {
                const comments = res.data.comments || []
                comments.push(payload.comment)
                axios.patch(`/posts/${payload.postId}.json`, { comments })
                    .catch(err =>
                        dispatch(setMessage({
                            title: 'Erro',
                            text: 'Ocorreu um erro inesperado! :('
                        }))
                    )
                    .then(res => {
                        dispatch(getPosts())
                    })
            })
    }

}

// recebe um array de posts e retorna uma acion do tipo SET_POSTS
export const setPosts = posts => {
    return {
        type: SET_POSTS,
        payload: posts
    }
}

// obtem de froma assyncrona os posts no firebase
export const getPosts = () => {
    return dispatch => {
        // a url base está configurada pelo axios no arquivo App.js
        axios.get('/posts.json')
            // tratamento do erro    
            .catch(err =>
                dispatch(setMessage({
                    title: 'Erro',
                    text: 'Ocorreu um erro inesperado! :('
                }))
            )
            // caso positivo  recebe o objeo dentro de res.data
            .then(res => {
                // repassa o objeto que está dentro do firebase (banco de dados) para a constante rawPosts
                const rawPosts = res.data
                const posts = []
                // laço for para pegar cada registro de dentro de rawPosts
                for (let key in rawPosts) {
                    // clona a partir da chave key todos os atributos de dentro do objeto rawPosts
                    posts.push({
                        ...rawPosts[key],
                        // define o valor do id o mesmo valor da key
                        id: key
                    })
                }

                dispatch(setPosts(posts.reverse())) // o reverse faz com que a última postagem fique em cima 
            })
    }
}

export const creatingPost = () => {
    return {
        type: CREATING_POST
    }
}

export const postCreated = () => {
    return {
        type: POST_CREATED
    }
}