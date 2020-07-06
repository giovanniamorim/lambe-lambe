import {
    SET_POSTS,
    ADD_COMMENT,
    CREATING_POST,
    POST_CREATED
} from '../actions/actionTypes'

const initialState = {

    posts: [],
    isUploading: false
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_POSTS:
            return {
                // retorna o estado atual
                ...state,
                // altera o estado da aplicação com lista de posts, 
                // mas mantem os atributos não alterados
                posts: action.payload
            }
        case ADD_COMMENT:
            return {
                ...state,
                posts: state.posts.map(post => {
                    if (post.id === action.payload.postId) {
                        if (post.comments) {
                            post.comments = post.comments.concat(
                                action.payload.comment
                            )
                        } else {
                            post.comments = [action.payload.comment]
                        }
                    }

                    return post
                })
            }
        case CREATING_POST:
            return {
                ...state,
                isUploading: true
            }
        case POST_CREATED:
            return {
                ...state, // ... operador sprea que retorna o estado atual
                isUploading: false
            }
        default:
            return state
    }
}

export default reducer


