// Programmer Name   : Mr. Chong Yuan Cheng, TP063577, Bac(Hons) Degree in Software Engineering, Asia Pacific University (APU), Malaysia.
// Program Name      : client/src/services/PostService.js
// Description       : PostService.js is a service file that provides functions to interact with the backend of the application.
import Api from "./Api";

export default {
    getPostsUserPersonal(user) {
        console.log(user);
        return Api().post("userPosts/getPersonal", user);
    },
    createPostUser(postForm) {
        return Api().post("userPosts/create", postForm, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
    },
    deletePostUser(post){
        return Api().delete("userPosts/delete", {data: post});
    },
    editPostUser(post){
        return Api().post("userPosts/update", post);
    },

    getPostsClubCommittee(user) {
        console.log(user);
        return Api().post("clubPosts/getClub", user);
    },
    
    createPostClub(postForm) {
        return Api().post("clubPosts/create", postForm, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
    },
    deletePostClub(post){
        return Api().delete("clubPosts/delete", {data: post});
    },
    editPostClub(post){
        return Api().post("clubPosts/update", post);
    },

    getAllPosts(user) {
        return Api().post("posts/getAll", user);
    },
    getAllPostsClubOnly(user){
        return Api().post("posts/getAllClubOnly", user);
    
    },
    likePost(post){
        return Api().post("posts/like", post);
    },
    unlikePost(post){
        return Api().post("posts/unlike", post);
    }
}