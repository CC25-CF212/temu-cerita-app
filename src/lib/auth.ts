export async function login(email: string, password: string): Promise<boolean> {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' }
    })

    if (!res.ok) return false
    // Simpan token di cookie/localStorage (jika ada)
    return true
  } catch (err) {
    return false
  }
}
