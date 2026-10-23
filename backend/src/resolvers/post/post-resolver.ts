import {
  Arg,
  Authorized,
  Ctx,
  Mutation,
  Query,
  Resolver,
  Int,
} from 'type-graphql';
import { GraphQLError } from 'graphql';
import Post from '../../entities/post/post';
import { MyContext } from '../..';
import InputCreatePost from '../../entities/post/input-create';

export interface PostWhereConditions {
  user?: {
    id: string;
  };
}
@Resolver(Post)
export default class PostResolver {
  @Query(() => [Post])
  async getPaginatedPosts(
    @Ctx() ctx: MyContext,
    @Arg('userId', { nullable: true }) userId?: string,
    @Arg('skip', () => Int, { defaultValue: 0 }) skip = 0,
    @Arg('take', () => Int, { defaultValue: 15 }) take = 15,
  ): Promise<Post[]> {
    // if (!ctx.user) {
    //   throw new Error('You must be authenticated to access activities.');
    // }

    let whereConditions: PostWhereConditions = {};
    if (userId) {
      whereConditions = {
        user: { id: userId },
      };
    }

    return Post.find({
      relations: ['user'],
      where: whereConditions,
      order: { createdAt: 'DESC' },
      skip,
      take,
    });
  }

  @Authorized()
  @Query(() => [Post])
  async getAllPosts() {
    try {
      const allPosts = await Post.find({ relations: ['user'] });
      return allPosts;
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw new GraphQLError('An error occurred while fetching posts');
    }
  }

  @Authorized()
  @Query(() => Post, { nullable: true })
  async getPostById(@Arg('postId') postId: number) {
    try {
      const post = await Post.findOne({
        where: { id: postId },
        relations: { user: true },
      });

      if (!post) {
        throw new Error('Post not found');
      }

      return post;
    } catch (error) {
      console.error('Error fetching post by ID:', error);
      throw new GraphQLError('An error occurred while fetching the post');
    }
  }

  @Authorized()
  @Mutation(() => Post)
  async createPost(
    @Ctx() ctx: MyContext,
    @Arg('data', { validate: true }) data: InputCreatePost,
  ) {
    const newPost = new Post();
    if (!ctx.user) {
      throw new Error('You must be authenticated to create a new post.');
    }
    Object.assign(newPost, data);
    newPost.user = ctx.user;
    await newPost.save();

    return newPost;
  }

  @Authorized()
  @Mutation(() => Boolean)
  async deletePost(@Arg('postId') postId: number, @Ctx() ctx: MyContext) {
    if (!ctx.user) {
      throw new Error('You must be authenticated to delete a post.');
    }

    try {
      const result = await Post.delete(postId);
      if (result.affected === 0) {
        throw new Error('Post not found or already deleted.');
      }
      return true;
    } catch (error) {
      console.error('Error deleting post:', error);
      throw new GraphQLError('An error occurred while deleting the post');
    }
  }

  @Authorized()
  @Mutation(() => Post)
  async updatePost(
    @Ctx() ctx: MyContext,
    @Arg('postId') id: number,
    @Arg('title') title: string,
    @Arg('content') content: string,
  ) {
    if (!ctx.user) {
      throw new Error('You must be authenticated to update a post.');
    }

    try {
      const postToUpdate = await Post.findOne({
        where: { id },
        relations: { user: true },
      });

      if (!postToUpdate) {
        throw new Error('Post not found');
      }

      postToUpdate.title = title;
      postToUpdate.content = content;

      await postToUpdate.save();

      return postToUpdate;
    } catch (error) {
      console.error('Error updating post:', error);
      throw new GraphQLError('An error occurred while updating the post');
    }
  }
}
