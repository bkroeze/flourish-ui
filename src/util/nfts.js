import axios from 'axios';
const IPFS_SERVER = process.env.IPFS_SERVER || 'https://ipfs.io/'

export function urlFormat(uri) {
  if (uri.startsWith('ipfs://')) {
    return `${IPFS_SERVER}ipfs/${uri.slice(7)}`
  }
  return uri
}

export async function getMetadata(uri) {
  const response = await axios.get(urlFormat(uri));
  return response.data;
}
