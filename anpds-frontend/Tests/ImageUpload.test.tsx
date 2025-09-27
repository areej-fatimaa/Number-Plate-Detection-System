import { createMocks } from 'node-mocks-http';
import uploadImageHandler from '@/pages/api/UploadImage'; // Update with the correct path
import axios from 'axios';

// Mock Axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('API Route: uploadImageHandler', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns 405 for non-POST requests', async () => {
    const { req, res } = createMocks({
      method: 'GET', // Simulate a GET request
    });

    await uploadImageHandler(req, res);

    expect(res._getStatusCode()).toBe(405);
    expect(res._getData()).toEqual(expect.stringContaining('Method not allowed'));
  });

  it('returns 400 if no file is provided', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {}, // No file in the body
    });

    await uploadImageHandler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(res._getData()).toEqual(expect.stringContaining('No file provided'));
  });

  it('uploads the image successfully', async () => {
    const mockImgurResponse = {
      data: {
        data: {
          link: 'https://imgur.com/example.jpg',
        },
      },
      status: 200,
    };

    mockedAxios.post.mockResolvedValueOnce(mockImgurResponse);

    const { req, res } = createMocks({
      method: 'POST',
      body: { file: 'fakeImageData' },
    });

    await uploadImageHandler(req, res);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      'https://api.imgur.com/3/image',
      { image: 'fakeImageData' },
      {
        headers: { Authorization: `Client-ID b4f339706bb7962` },
      }
    );

    expect(res._getStatusCode()).toBe(200);
    const jsonResponse = JSON.parse(res._getData());
    expect(jsonResponse).toEqual({ link: 'https://imgur.com/example.jpg' });
  });

  it('returns 500 if Imgur upload fails', async () => {
    mockedAxios.post.mockRejectedValueOnce({
      response: {
        status: 500,
        data: { error: 'Upload failed' },
      },
    });

    const { req, res } = createMocks({
      method: 'POST',
      body: { file: 'fakeImageData' },
    });

    await uploadImageHandler(req, res);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      'https://api.imgur.com/3/image',
      { image: 'fakeImageData' },
      {
        headers: { Authorization: `Client-ID b4f339706bb7962` },
      }
    );

    expect(res._getStatusCode()).toBe(500);
    const jsonResponse = JSON.parse(res._getData());
    expect(jsonResponse).toEqual({ error: 'Failed to upload image' });
  });
});
