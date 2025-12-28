export const adminLogin = () => {
  return cy.request({
    method: 'POST',
    url: '/api/auth/login',
    body: {
      username: 'admin',
      password: 'password'
    }
  }).then((res) => {
    expect(res.status).to.eq(200)
  })
}