// Programmer Name   : Mr. Chong Yuan Cheng, TP063577, Bac(Hons) Degree in Software Engineering, Asia Pacific University (APU), Malaysia.
// Program Name      : server/src/controller/PostController.ts
// Description       : The controller to manage the post.
import { Request, Response } from "express";
import path from 'path';
import fs from 'fs';


const { User, Club, Post, PostLiked } = require('../models');


module.exports ={
    async personalPostListRequest(req: Request, res: Response){
        try{
            const personalPosts = await Post.findAll({
                where: {
                    userId: req.body.userId,
                    clubId: null
                }
            });
            return res.status(200).send(personalPosts);
        } catch (err) {
            console.log(err);
            return res.status(400).send({
                error: 'Error fetching personal posts'
            });
        }
    },
    async createUserPost(req: Request, res: Response){
        try{
            if(req.file){
                req.body.imageUrl = 'uploads/' + path.basename(req.file.path);
            }
            const post = await Post.create({...req.body, clubOnly: false, postDate: new Date()});
            return res.status(200).send(post);
        } catch (err) {
            console.log(err);
            return res.status(400).send({
                error: 'Error creating post'
            });
        }
    },
    async deleteUserPost(req: Request, res: Response){
        try{
            console.log(req.body.id)
            
            const post = await Post.findOne({
                where: {
                    id: req.body.id
                }
            });
            if(!post) return res.status(400).send({error: 'Post not found'});
            if(post.imageUrl){
                const filePath = path.join(__dirname, '../../', post.imageUrl);
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.log(err);
                        return res.status(400).send({ error: 'Error removing img' });
                    }
                });
            }
            await post.destroy();
            return res.status(200).send({ message: 'Post deleted' });
        } catch (err) {
            console.log(err);
            return res.status(400).send({
                error: 'Error deleting post'
            });
        }
    },
    async updateUserPost(req: Request, res: Response){
        try{
            await Post.update({
                postTitle: req.body.postTitle,
                postContent: req.body.postContent
            }, {
                where: {
                    id: req.body.id
                }

            })
            return res.status(200).send({ message: 'Post updated' });
        }catch (err) {
            console.log(err);
            return res.status(400).send({
                error: 'Error creating post'
            });
        }
    },
    async clubPostListRequest(req: Request, res: Response){
        try{
            const personalPosts = await Post.findAll({
                where: {
                    clubId: req.body.clubId
                },
                include: [
                    {
                        model: User,
                        attributes: { exclude: ['password'] }
                    }
                ]
            });
            return res.status(200).send(personalPosts);
        } catch (err) {
            console.log(err);
            return res.status(400).send({
                error: 'Error fetching personal posts'
            });
        }
    },
    async createClubPost(req: Request, res: Response){
        try{
            if(req.file){
                req.body.imageUrl = 'uploads/' + path.basename(req.file.path);
            }
            console.log(req.body);
            const post = await Post.create({...req.body, postDate: new Date()});
            return res.status(200).send({message: 'Post created'});
        } catch (err) {
            console.log(err);
            return res.status(400).send({
                error: 'Error creating post'
            });
        }
    },
    async deleteClubPost(req: Request, res: Response){
        try{
            console.log(req.body.id)
            
            const post = await Post.findOne({
                where: {
                    id: req.body.id
                }
            });
            if(!post) return res.status(400).send({error: 'Post not found'});
            if(post.imageUrl){
                const filePath = path.join(__dirname, '../../', post.imageUrl);
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.log(err);
                        return res.status(400).send({ error: 'Error removing img' });
                    }
                });
            }
            await post.destroy();
            return res.status(200).send({ message: 'Post deleted' });
        } catch (err) {
            console.log(err);
            return res.status(400).send({
                error: 'Error deleting post'
            });
        }
    },
    async updateClubPost(req: Request, res: Response){
        try{
            await Post.update({
                postTitle: req.body.postTitle,
                postContent: req.body.postContent,
                clubOnly: req.body.clubOnly
            }, {
                where: {
                    id: req.body.id
                }

            })
            return res.status(200).send({ message: 'Post updated' });
        }catch (err) {
            console.log(err);
            return res.status(400).send({
                error: 'Error creating post'
            });
        }
    },
    async getAllPosts(req: Request, res: Response){
        try{
            const allPosts = await Post.findAll(
                {
                    where: {clubOnly: false},
                    include: [
                        {
                            model: User,
                            attributes: ['name']
                        },
                        {
                            model: Club,
                            attributes: ['clubName']
                        }
                    ]
                    
                }
            );
            const allPostsWithLikes = await Promise.all(allPosts.map(async (post: any) => {
                const likesCount = await PostLiked.count({ where: { postId: post.id } });
                const postLikedEntry = await PostLiked.findOne({ where: { postId: post.id, userId: req.body.userId } });
                const isLiked = postLikedEntry !== null;
                return { ...post.toJSON(), likes: likesCount, isLiked: isLiked};
            }));
            return res.status(200).send(allPostsWithLikes);
        } catch (err) {
            console.log(err);
            return res.status(400).send({
                error: 'Error fetching posts'
            });
        }
    },
    async getAllPostsClubOnly(req: Request, res: Response){
        try{
            const allPosts = await Post.findAll(
                {
                    where: {clubOnly: true},
                    include: [
                        {
                            model: User,
                            attributes: ['name']
                        },
                        {
                            model: Club,
                            attributes: ['clubName'],
                            where: {id: req.body.clubId}
                        }
                    ]
                    
                }
            );
            const allPostsWithLikes = await Promise.all(allPosts.map(async (post: any) => {
                const likesCount = await PostLiked.count({ where: { postId: post.id } });
                const postLikedEntry = await PostLiked.findOne({ where: { postId: post.id, userId: req.body.userId } });
                const isLiked = postLikedEntry !== null;
                return { ...post.toJSON(), likes: likesCount, isLiked: isLiked};
            }));
            return res.status(200).send(allPostsWithLikes);
        } catch (err) {
            console.log(err);
            return res.status(400).send({
                error: 'Error fetching posts'
            });
        }
    },
    async likePost(req: Request, res: Response){
        try{
            await PostLiked.create({
                userId: req.body.userId,
                postId: req.body.postId
            });
            const likesCount = await PostLiked.count({ where: { postId: req.body.postId } })
            return res.status(200).send({
                likes: likesCount
            });
        } catch (err) {
            console.log(err);
            return res.status(400).send({
                error: 'Error liking post'
            });
        }
    },
    async unlikePost(req: Request, res: Response){
        try{
            await PostLiked.destroy({
                where: {
                    userId: req.body.userId,
                    postId: req.body.postId
                }
            });
            const likesCount = await PostLiked.count({ where: { postId: req.body.postId } })
            return res.status(200).send({
                likes: likesCount
            });
        } catch (err) {
            console.log(err);
            return res.status(400).send({
                error: 'Error unliking post'
            });
        }
    }
}