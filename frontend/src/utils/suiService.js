import { client, queryObjects } from './suiClient';

// Fetch shared Move struct objects by StructType using JSON-RPC helper
export async function fetchSharedObjectsByStruct(structType) {
  const res = await queryObjects({ filter: { StructType: structType }, options: { showContent: true } });
  // Normalise result: some RPC responses return { data: [...] }
  return res.data || res;
}

// Get all owned objects for an address (show content)
export async function getOwnedObjectsForAddress(owner) {
  return await client.getOwnedObjects({ owner, options: { showContent: true } });
}

// Forward dynamic field lookup to the low-level client
export async function getDynamicFieldObject(params) {
  return await client.getDynamicFieldObject(params);
}

export async function getObject(id) {
  return await client.getObject({ id, options: { showContent: true } });
}

export default {
  fetchSharedObjectsByStruct,
  getOwnedObjectsForAddress,
  getDynamicFieldObject,
  getObject,
};
