// tests/integration/posts.test.js

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../server');
const Post = require('../../models/Post');
const Category = require('../../models/Category');
const User = require('../../models/User');

let token;
let postId;
let categoryId;


beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI_TEST);

  // Register test user
  const registerRes = await request(app).post('/api/auth/signup').send({
    username: 'testuser',
    email: 'test@example.com',
    password: '123456',
  });

  console.log('REGISTER RESPONSE:', registerRes.body);
  expect(registerRes.statusCode).toBe(201);
  expect(registerRes.body.user).toBeDefined();
  expect(registerRes.body.token).toBeDefined();

  // Login test user
  const loginRes = await request(app).post('/api/auth/login').send({
    email: 'test@example.com',
    password: '123456',
  });

  console.log('LOGIN RESPONSE:', loginRes.body);
  expect(loginRes.statusCode).toBe(200);
  expect(loginRes.body.user).toBeDefined();
  expect(loginRes.body.token).toBeDefined();

  token = loginRes.body.token;
  const userId = loginRes.body.user._id || loginRes.body.user.id;

  // Create a category
  const category = await Category.create({ name: 'Tech' });
  categoryId = category._id;

  // Create a post
  const post = await Post.create({
    title: 'First Post',
    content: 'This is a test post',
    slug: 'first-post',
    author: userId,
    category: categoryId,
  });

  postId = post._id;
});

afterAll(async () => {
  await Post.deleteMany();
  await Category.deleteMany();
  await User.deleteMany();
  await mongoose.connection.close();
});

describe('POST /api/posts', () => {
  it('should create a new post when authenticated', async () => {
    const res = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'New Post',
        content: 'Content here',
        slug: 'new-post',
        category: categoryId,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('New Post');
  });

  it('should return 401 if not authenticated', async () => {
    const res = await request(app).post('/api/posts').send({});
    expect(res.statusCode).toBe(401);
  });

  it('should return 400 if validation fails', async () => {
    const res = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({});
    expect(res.statusCode).toBe(400);
  });
});

describe('GET /api/posts', () => {
  it('should return all posts', async () => {
    const res = await request(app).get('/api/posts');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should filter posts by category', async () => {
    const res = await request(app).get(`/api/posts?category=${categoryId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.every((post) => String(post.category) === String(categoryId))).toBe(true);
  });

  it('should paginate results', async () => {
    const res = await request(app).get('/api/posts?page=1&limit=10');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe('GET /api/posts/:id', () => {
  it('should return a post by ID', async () => {
    const res = await request(app).get(`/api/posts/${postId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(String(postId));
  });

  it('should return 404 for non-existent post', async () => {
    const res = await request(app).get(`/api/posts/${mongoose.Types.ObjectId()}`);
    expect(res.statusCode).toBe(404);
  });
});

describe('PUT /api/posts/:id', () => {
  it('should update a post when authenticated as author', async () => {
    const res = await request(app)
      .put(`/api/posts/${postId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Updated Title', slug: 'updated-slug' });

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('Updated Title');
  });

  it('should return 401 if not authenticated', async () => {
    const res = await request(app).put(`/api/posts/${postId}`).send({});
    expect(res.statusCode).toBe(401);
  });

  it('should return 403 if not the author', async () => {
    // Create another user
    await request(app).post('/api/auth/signup').send({
      username: 'anotheruser',
      email: 'another@example.com',
      password: '654321',
    });
    const login = await request(app).post('/api/auth/login').send({
      email: 'another@example.com',
      password: '654321',
    });

    const otherToken = login.body.token;

    const res = await request(app)
      .put(`/api/posts/${postId}`)
      .set('Authorization', `Bearer ${otherToken}`)
      .send({ title: 'Attempted Update', slug: 'attempted-update' });

    expect(res.statusCode).toBe(403);
  });
});

describe('DELETE /api/posts/:id', () => {
  it('should delete a post when authenticated as author', async () => {
    const res = await request(app)
      .delete(`/api/posts/${postId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  });

  it('should return 401 if not authenticated', async () => {
    const res = await request(app).delete(`/api/posts/${postId}`);
    expect(res.statusCode).toBe(401);
  });
});
