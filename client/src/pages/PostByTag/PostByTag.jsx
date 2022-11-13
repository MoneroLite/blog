import React from "react";
import Grid from "@mui/material/Grid";
import { Post } from "../../components/Post";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPostByTags } from "../../redux/slices/posts";
import { useParams } from "react-router-dom";

export const PostByTag = () => {
    const { id } = useParams()
    const dispatch = useDispatch();
    const { posts } = useSelector((state) => state.posts);
    const userData = useSelector((state) => state.auth.data);

    const isPostLoading = posts.status === "loading";
    //   const isTagsLoading = tags.status === "loading";

    useEffect(() => {
        dispatch(fetchPostByTags(id));
        // dispatch(fetchTags());
    }, []);
    // console.log(userData);
    console.log(id);

    // const PostByTag = () => {
    return (
        <>
            <Grid container spacing={4}>
                <Grid xs={8} item>
                    {(isPostLoading ? [...Array(5)] : posts.items).map((obj, index) =>
                        isPostLoading ? (
                            <Post key={index} isLoading={true} />
                        ) :
                            (
                                <Post
                                    id={obj._id}
                                    key={index}
                                    title={obj.title}
                                    imageUrl={
                                        obj.imageUrl ? `http://localhost:5000${obj.imageUrl}` : ""
                                    }
                                    user={obj.user}
                                    createdAt={obj.createdAt}
                                    viewsCount={obj.viewsCount}
                                    commentsCount={3}
                                    tags={obj.tags}
                                    isEditable={userData?.userData._id === obj?.user._id}
                                />
                            )
                    )}
                </Grid>
            </Grid>
        </>
    )
}

export default PostByTag