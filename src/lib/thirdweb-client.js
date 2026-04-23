import { createThirdwebClient } from 'thirdweb';

/**
 * Single ThirdWeb client instance shared across the entire app.
 *
 * NEVER call createThirdwebClient() anywhere else — ThirdWeb v5 scopes
 * wallet connection state to the client object reference. Two separate
 * instances = two separate states = useActiveAccount() returns undefined
 * in components that aren't using the same instance the ConnectButton used.
 */
console.log("CLIENT ID:", process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID);

export const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
});

