import { configureStore } from "@reduxjs/toolkit";
import { postRedicer } from "./slices/posts";

const store = configureStore({
    reducer: {
        posts: postRedicer
    },

})

export default store