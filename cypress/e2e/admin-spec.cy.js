//Create a Room using the Admin page(API) and check that the room was created on the User page(API)

it('Create room via Admin API and verify via GET', () => {
  cy.adminLogin()

  const roomName = `Test ${Math.floor(1000 + Math.random() * 9000)}`

  cy.request('POST', '/api/room', {
    roomName,
    type: 'Suite',
    accessible: true,
    roomPrice: 120,
    features: ['WiFi']
  })

  cy.request('GET', '/api/room').then((res) => {
    expect(res.status).to.eq(200)

    expect(
      res.body.rooms.some(room => room.roomName === roomName)
    ).to.eq(true)
  })
})

// //Book the room using the User page(API), and then check that the room is booked on the Admin page(API)
it('Book room and verify via Admin API', () => {
    const checkIn = new Date()
    checkIn.setDate(checkIn.getDate() + Math.floor(Math.random() * 30) + 30)
    const checkOut = new Date(checkIn)
    checkOut.setDate(checkIn.getDate() + 1)

    const checkInISO = checkIn.toISOString().split('T')[0]
    const checkOutISO = checkOut.toISOString().split('T')[0]

    cy.request({
        method: 'POST',
        url: '/api/booking',
        failOnStatusCode: false,
        body: {
            roomid: 1,
            firstname: 'Test',
            lastname: 'User',
            email: `test${Date.now()}@test.com`,
            phone: '380999999999',
            depositpaid: false,
            bookingdates: { checkin: checkInISO, checkout: checkOutISO }
        }
    })


    cy.adminLogin().then(token => {
        cy.request({
            method: 'GET',
            url: '/api/report/room/1',
            headers: { Authorization: `Bearer ${token}` }
        }).then(response => {
            expect(response.status).to.eq(200)

            const bookings = response.body || []
            let found = false

            for (const b of bookings) {
                if (b.start === checkInISO && b.end === checkOutISO) {
                    found = true
                    break
                }
            }

            expect(found).to.be.true
        })
    })
})


//Edit Room in the Admin page (Rooms) menu using API and check changes in the User page(API)
it('Edit room via Admin API and verify via User API', () => {
  cy.adminLogin().then(token => {
    const roomName = `Test ${Math.floor(1000 + Math.random() * 9000)}`
    const updatedName = roomName + ' Updated'

    // Create new room
    cy.request({
      method: 'POST',
      url: '/api/room',
      headers: { Authorization: `Bearer ${token}` },
      body: { roomName, type: 'Suite', accessible: true, roomPrice: 120, features: ['WiFi'] }
    }).then(createRes => {
      expect(createRes.status).to.eq(200)
      cy.wait(5000)

      //GET Admin API => get roomId
      cy.request({
        method: 'GET',
        url: '/api/room'
      }).then(getRes => {
        expect(getRes.status).to.eq(200)
        const room = getRes.body.rooms.find(r => r.roomName === roomName)
        expect(room).to.exist
        const roomId = room.roomid
        expect(roomId).to.exist

        //PUT Admin API => edit room
        cy.request({
          method: 'PUT',
          url: `/api/room/${roomId}`,
          headers: { Authorization: `Bearer ${token}` },
          body: {
            roomName: updatedName,
            type: 'Suite',
            roomPrice: 120,
            accessible: true,
            features: ['WiFi']
          }
        }).then(editRes => {
          expect(editRes.status).to.eq(200)

          //GET User API => check updated data
          cy.request({
            method: 'GET',
            url: '/api/room'
          }).then(userRes => {
            expect(userRes.status).to.eq(200)
            const userRoom = userRes.body.rooms.find(r => r.roomid === roomId)
            expect(userRoom).to.exist
            expect(userRoom.roomName).to.eq(updatedName)
          })
        })
      })
    })
  })
})

//Delete the Room using the Admin page(API) and check that the room was deleted in the User page(API)
it('Delete room via Admin API and verify via User API', () => {
  cy.adminLogin().then(token => {
    const roomName = `Test ${Math.floor(1000 + Math.random() * 9000)}`

    // Create new room
    cy.request({
      method: 'POST',
      url: '/api/room',
      headers: { Authorization: `Bearer ${token}` },
      body: { roomName, type: 'Suite', accessible: true, roomPrice: 120, features: ['WiFi'] }
    }).then(createRes => {
      expect(createRes.status).to.eq(200)
      cy.wait(5000)

      //GET Admin API => get roomId
      cy.request({
        method: 'GET',
        url: '/api/room'
      }).then(getRes => {
        expect(getRes.status).to.eq(200)
        const room = getRes.body.rooms.find(r => r.roomName === roomName)
        expect(room).to.exist
        const roomId = room.roomid
        expect(roomId).to.exist

        // DELETE Admin API => delete room
        cy.request({
          method: 'DELETE',
          url: `/api/room/${roomId}`,
          headers: { Authorization: `Bearer ${token}` }
        }).then(deleteRes => {
          expect(deleteRes.status).to.eq(200)

          // GET User API and check that room was deleted
          cy.request({
            method: 'GET',
            url: '/api/room'
          }).then(userRes => {
            expect(userRes.status).to.eq(200)
            const userRoom = userRes.body.rooms.find(r => r.roomid === roomId)
            expect(userRoom).to.not.exist
          })
        })
      })
    })
  })
})

