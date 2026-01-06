export const Coffee_Config = {
  baseURL: 'http://localhost:5292',
  headers: {
    'Content-Type': 'application/json',
  },
};


export const login = async (email: string, password: string) => {
    console.log('login: POST', `${Coffee_Config.baseURL}/api/Users/login`, { email });
    const response = await fetch(`${Coffee_Config.baseURL}/api/Users/login`, {
      method: 'POST',
      headers: Coffee_Config.headers,
      body: JSON.stringify({ email, password }),
    });

    const text = await response.text();
    console.log('login response status', response.status, 'body', text);

    if(!response.ok) {
      let msg = 'Login failed';
      try {
        const parsed = JSON.parse(text);
        msg = parsed?.message || parsed?.error || msg;
      } catch {
        if (text) msg = text
      }
      throw new Error(msg);
    }

  const data = JSON.parse(text);
  return data.result ?? data;
};

export const register = async (userData: {
  name: string;
  surname: string;
  email: string;
  password: string;
  address: string;
  phone: string;
  city?: string | null;
}) => {
  console.log('register: POST', `${Coffee_Config.baseURL}/api/Users/register`, { ...userData, password: '***' });
  const response = await fetch(`${Coffee_Config.baseURL}/api/Users/register`, {
    method: 'POST',
    headers: Coffee_Config.headers,
    body: JSON.stringify(userData),
  });

  const text = await response.text();
  console.log('register response status', response.status, 'body', text);

  if (!response.ok) {
    let msg = 'Registration failed';
    try {
      const parsed = JSON.parse(text);
      msg = parsed?.message || msg;
    } catch {}
    throw new Error(msg);
  }

  const data = JSON.parse(text);
  return data.result ?? data;
};

export const fetchProducts = async (category?: string, userId?: number | string) => {
  const params: string[] = [];
  if (category) params.push(`category=${encodeURIComponent(String(category))}`);
  if (userId !== undefined && userId !== null) params.push(`userId=${encodeURIComponent(String(userId))}`);
  const qs = params.length ? `?${params.join('&')}` : '';
  const url = `${Coffee_Config.baseURL}/api/Coffees${qs}`;
  console.log('fetchProducts: GET', url);
  const response = await fetch(url, {
    method: 'GET',
    headers: Coffee_Config.headers,
  });

  const text = await response.text();
  console.log('fetchProducts response status', response.status, 'body', text);

  if (!response.ok) {
    let msg = 'Fetch products failed';
    try {
      const parsed = JSON.parse(text);
      msg = parsed?.message || msg;
    } catch {}
    throw new Error(msg);
  }

  const data = JSON.parse(text);
  return data.result ?? data;
};

export const LikeProduct = async (productId: string) => {
  console.log('LikeProduct: POST', `${Coffee_Config.baseURL}/api/Likes/toggle`);
  const response = await fetch(`${Coffee_Config.baseURL}/api/Coffees/${productId}/like`, {
    method: 'POST',
    headers: Coffee_Config.headers,
  });

  const text = await response.text();
  console.log('LikeProduct response status', response.status, 'body', text);

  if (!response.ok) {
    let msg = 'Like product failed';
    try {
      const parsed = JSON.parse(text);
      msg = parsed?.message || msg;
    } catch {}
    throw new Error(msg);
  }

  const data = JSON.parse(text);
  return data.result ?? data;
};

// Create a like: POST /api/Likes { coffeeId, userId }
export const createLike = async (coffeeId: number | string, userId?: number | string) => {
  const url = `${Coffee_Config.baseURL}/api/Likes`;
  const body = { coffeeId, userId: userId ?? null };
  console.log('createLike: POST', url, body);
  const response = await fetch(url, { method: 'POST', headers: Coffee_Config.headers, body: JSON.stringify(body) });
  const text = await response.text();
  console.log('createLike response status', response.status, 'body', text);
  if (!response.ok) {
    let msg = 'Create like failed';
    try { const parsed = JSON.parse(text); msg = parsed?.message || msg } catch {}
    throw new Error(msg);
  }
  const data = JSON.parse(text);
  return data.result ?? data;
}

// Delete a like by id (server expects query param userId optionally): DELETE /api/Likes/{id}?userId={userId}
export const deleteLike = async (id: number | string, userId?: number | string) => {
  const q = userId ? `?userId=${encodeURIComponent(String(userId))}` : '';
  const url = `${Coffee_Config.baseURL}/api/Likes/${id}${q}`;
  console.log('deleteLike: DELETE', url);
  const response = await fetch(url, { method: 'DELETE', headers: Coffee_Config.headers });
  const text = await response.text();
  console.log('deleteLike response status', response.status, 'body', text);
  if (!response.ok) {
    let msg = 'Delete like failed';
    try { const parsed = JSON.parse(text); msg = parsed?.message || msg } catch {}
    throw new Error(msg);
  }
  const data = JSON.parse(text);
  return data.result ?? data;
}

export const fetchLikesByUser = async (userId: number | string) => {
  const url = `${Coffee_Config.baseURL}/api/Likes/user/${userId}`;
  console.log('fetchLikesByUser: GET', url);
  const response = await fetch(url, { method: 'GET', headers: Coffee_Config.headers });
  const text = await response.text();
  console.log('fetchLikesByUser response status', response.status, 'body', text);
  if (!response.ok) {
    let msg = 'Fetch likes failed';
    try { const parsed = JSON.parse(text); msg = parsed?.message || msg } catch {}
    throw new Error(msg);
  }
  const data = JSON.parse(text);
  return data.result ?? data;
}

export const fetchLikesByCoffee = async (coffeeId: number | string) => {
  const url = `${Coffee_Config.baseURL}/api/Likes/coffee/${coffeeId}`;
  console.log('fetchLikesByCoffee: GET', url);
  const response = await fetch(url, { method: 'GET', headers: Coffee_Config.headers });
  const text = await response.text();
  console.log('fetchLikesByCoffee response status', response.status, 'body', text);
  if (!response.ok) {
    let msg = 'Fetch likes by coffee failed';
    try { const parsed = JSON.parse(text); msg = parsed?.message || msg } catch {}
    throw new Error(msg);
  }
  const data = JSON.parse(text);
  return data.result ?? data;
}

export const fetchProductById = async (id: string | number) => {
  const url = `${Coffee_Config.baseURL}/api/Coffees/${id}`;
  console.log('fetchProductById: GET', url);
  const response = await fetch(url, { method: 'GET', headers: Coffee_Config.headers });
  const text = await response.text();
  console.log('fetchProductById response status', response.status, 'body', text);
  if (!response.ok) {
    let msg = 'Fetch product failed';
    try {
      const parsed = JSON.parse(text);
      msg = parsed?.message || msg;
    } catch {}
    throw new Error(msg);
  }
  const data = JSON.parse(text);
  return data.result ?? data;
}

export const addToCart = async (coffeeId: number | string, quantity = 1, size = 1, userId?: number | string) => {
  const url = `${Coffee_Config.baseURL}/api/Cart`;
  const body = userId ? { coffeeId, quantity, size, userId } : { coffeeId, quantity, size }
  console.log('addToCart: POST', url, body);
  const response = await fetch(url, {
    method: 'POST',
    headers: Coffee_Config.headers,
    body: JSON.stringify(body),
  });
  const text = await response.text();
  console.log('addToCart response status', response.status, 'body', text);
  if (!response.ok) {
    let msg = 'Add to cart failed';
    try {
      const parsed = JSON.parse(text);
      msg = parsed?.message || msg;
    } catch {}
    throw new Error(msg);
  }
  const data = JSON.parse(text);
  return data.result ?? data;
}

export const deleteCartItem = async (cartItemId: number | string) => {
  const url = `${Coffee_Config.baseURL}/api/Cart/${cartItemId}`;
  console.log('deleteCartItem: DELETE', url);
  const response = await fetch(url, { method: 'DELETE', headers: Coffee_Config.headers });
  const text = await response.text();
  console.log('deleteCartItem response status', response.status, 'body', text);
  if (!response.ok) {
    let msg = 'Delete cart item failed';
    try {
      const parsed = JSON.parse(text);
      msg = parsed?.message || msg;
    } catch {}
    throw new Error(msg);
  }
  const data = JSON.parse(text);
  return data.result ?? data;
}

export const decrementCartItem = async (cartItemId: number | string, amount = 1) => {
  const url = `${Coffee_Config.baseURL}/api/Cart/${cartItemId}/decrement?amount=${encodeURIComponent(String(amount))}`;
  console.log('decrementCartItem: POST', url);
  const response = await fetch(url, { method: 'POST', headers: Coffee_Config.headers });
  const text = await response.text();
  console.log('decrementCartItem response status', response.status, 'body', text);
  if (!response.ok) {
    let msg = 'Decrement cart item failed';
    try {
      const parsed = JSON.parse(text);
      msg = parsed?.message || msg;
    } catch {}
    throw new Error(msg);
  }
  const data = JSON.parse(text);
  return data.result ?? data;
}

export const incrementCartItem = async (cartItemId: number | string, amount = 1) => {
  const url = `${Coffee_Config.baseURL}/api/Cart/${cartItemId}/increment?amount=${encodeURIComponent(String(amount))}`;
  console.log('incrementCartItem: POST', url);
  const response = await fetch(url, { method: 'POST', headers: Coffee_Config.headers });
  const text = await response.text();
  console.log('incrementCartItem response status', response.status, 'body', text);
  if (!response.ok) {
    let msg = 'Increment cart item failed';
    try {
      const parsed = JSON.parse(text);
      msg = parsed?.message || msg;
    } catch {}
    throw new Error(msg);
  }
  const data = JSON.parse(text);
  return data.result ?? data;
}

export const fetchCartByUser = async (userId: number | string) => {
  const url = `${Coffee_Config.baseURL}/api/Cart/user/${userId}`;
  console.log('fetchCartByUser: GET', url);
  const response = await fetch(url, { method: 'GET', headers: Coffee_Config.headers });
  const text = await response.text();
  console.log('fetchCartByUser response status', response.status, 'body', text);
  if (!response.ok) {
    let msg = 'Fetch cart failed';
    try {
      const parsed = JSON.parse(text);
      msg = parsed?.message || msg;
    } catch {}
    throw new Error(msg);
  }
  const data = JSON.parse(text);
  return data.result ?? data;
}

export const createOrder = async (userId: number | string) => {
  const url = `${Coffee_Config.baseURL}/api/Orders`;
  const body = { userId };
  console.log('createOrder: POST', url, body);
  const response = await fetch(url, { method: 'POST', headers: Coffee_Config.headers, body: JSON.stringify(body) });
  const text = await response.text();
  console.log('createOrder response status', response.status, 'body', text);
  if (!response.ok) {
    let msg = 'Create order failed';
    try { const parsed = JSON.parse(text); msg = parsed?.message || msg } catch {}
    throw new Error(msg);
  }
  const data = JSON.parse(text);
  return data.result ?? data;
}

export const updateUser = async (userId: number | string, updates: Record<string, any>) => {
  const url = `${Coffee_Config.baseURL}/api/Users/${userId}`;
  console.log('updateUser: PUT', url, updates);
  const response = await fetch(url, {
    method: 'PUT',
    headers: Coffee_Config.headers,
    body: JSON.stringify(updates),
  });
  const text = await response.text();
  console.log('updateUser response status', response.status, 'body', text);
  if (!response.ok) {
    let msg = 'Update user failed';
    try {
      const parsed = JSON.parse(text);
      msg = parsed?.message || msg;
    } catch {}
    throw new Error(msg);
  }
  const data = JSON.parse(text);
  return data.result ?? data;
}

export const fetchUserById = async (userId: number | string) => {
  const url = `${Coffee_Config.baseURL}/api/Users/${userId}`;
  console.log('fetchUserById: GET', url);
  const response = await fetch(url, { method: 'GET', headers: Coffee_Config.headers });
  const text = await response.text();
  console.log('fetchUserById response status', response.status, 'body', text);
  if (!response.ok) {
    let msg = 'Fetch user failed';
    try {
      const parsed = JSON.parse(text);
      msg = parsed?.message || msg;
    } catch {}
    throw new Error(msg);
  }
  const data = JSON.parse(text);
  return data.result ?? data;
}

export const uploadProfileImage = async (userId: number | string, fileUri: string, fileName?: string, mimeType?: string) => {
  const url = `${Coffee_Config.baseURL}/api/Users/${userId}/profile-image`;
  console.log('uploadProfileImage: POST', url, { fileUri, fileName, mimeType });

  const form = new FormData();
  const name = fileName || fileUri.split('/').pop() || 'upload.jpg';
  const type = mimeType || 'image/jpeg';
  try {
    const fileResp = await fetch(fileUri);
    const blob = await fileResp.blob();
    form.append('file', blob as any, name);
  } catch (e) {
    console.warn('Failed to fetch file as blob, falling back to uri object append', e);
    form.append('file', { uri: fileUri, name, type } as any);
  }

  const response = await fetch(url, { method: 'POST', body: form });
  const text = await response.text();
  console.log('uploadProfileImage response status', response.status, 'body', text);
  if (!response.ok) {
    let msg = 'Upload profile image failed';
    try {
      const parsed = JSON.parse(text);
      msg = parsed?.message || msg;
    } catch {}
    throw new Error(msg);
  }
  const data = JSON.parse(text);
  return data.result ?? data;
}
