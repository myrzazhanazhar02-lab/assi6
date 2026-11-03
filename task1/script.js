const party = [
  { id: 'balcony', name: 'Balcony', floor: 2, guests: [
    { name: 'Aigerim', color: 'green', time: '20:45', aitu: true, things: ['cup', 'crumbs'] },
    { name: 'Aliya', color: 'black', time: '21:15', aitu: false, things: ['phone', 'cup'] },
    { name: 'Madina', color: 'green', time: '22:10', aitu: false, things: ['phone', 'bag', 'crumbs'] },
    { name: 'Ivan', color: 'black', time: '20:10', aitu: true, things: ['cup'] }
  ] },
  { id: 'hall', name: 'Hall', floor: 2, guests: [
    { name: 'Arman', color: 'yellow', time: '20:35', aitu: false, things: ['bag', 'glasses'] },
    { name: 'Sophia', color: 'purple', time: '21:20', aitu: true, things: ['phone'] },
    { name: 'Dias', color: 'green', time: '19:45', aitu: true, things: [] },
    { name: 'Bekzat', color: 'purple', time: '20:55', aitu: false, things: ['bag', 'cup', 'crumbs'] },
    { name: 'Aruzhan', color: 'black', time: '21:50', aitu: true, things: ['phone'] },
    { name: 'Saule', color: 'green', time: '21:25', aitu: false, things: ['glasses'] }
  ] },
  { id: 'kitchen', name: 'Kitchen', floor: 1, guests: [
    { name: 'Nurlan', color: 'red', time: '19:40', aitu: true, things: ['phone', 'cup'] },
    { name: 'Emma', color: 'black', time: '20:15', aitu: false, things: ['bag'] },
    { name: 'Timur', color: 'green', time: '21:05', aitu: true, things: ['phone', 'bag', 'crumbs'] },
    { name: 'Sergey', color: 'yellow', time: '20:50', aitu: false, things: [] },
    { name: 'Yerlan', color: 'red', time: '21:40', aitu: true, things: ['glasses', 'phone'] },
    { name: 'Kamila', color: 'black', time: '20:05', aitu: false, things: ['cup'] }
  ] },
  { id: 'living', name: 'Living room', floor: 1, guests: [
    { name: 'Daniel', color: 'blue', time: '19:55', aitu: false, things: ['glasses'] },
    { name: 'Zarina', color: 'green', time: '21:10', aitu: false, things: ['bag', 'phone', 'crumbs'] },
    { name: 'Natasha', color: 'yellow', time: '20:30', aitu: true, things: [] },
    { name: 'Askar', color: 'black', time: '21:00', aitu: true, things: ['phone'] },
    { name: 'Inkar', color: 'purple', time: '20:20', aitu: false, things: ['bag'] }
  ] }
];

const miras = { name: 'Miras', color: 'blue', time: '21:20', aitu: true, things: ['phone'] };

const icons = { phone: '📱', glasses: '👓', bag: '👜', cup: '☕', crumbs: '🍰' };

function toMinutes(time) {
  const parts = time.split(':');
  return Number(parts[0]) * 60 + Number(parts[1]);
}

function makeCard(guest) {
  const card = $('<div class="guest"></div>')
    .addClass(guest.color)
    .toggleClass('aitu', guest.aitu)
    .attr({
      'data-name': guest.name,
      'data-time': guest.time,
      'data-min': toMinutes(guest.time),
      'data-color': guest.color,
      'data-aitu': guest.aitu,
      'data-things': guest.things.join(',')
    });

  let items = '';
  guest.things.forEach(function (thing) {
    card.addClass('has-' + thing);
    items += '<span class="item">' + icons[thing] + '</span>';
  });

  card.append('<img alt="' + guest.name + '" src="https://api.dicebear.com/9.x/open-peeps/svg?seed=' + guest.name + '">');
  if (guest.aitu) {
    card.append('<i class="badge">🎓</i>');
  }
  card.append('<span class="name">' + guest.name + '</span>');
  card.append('<span class="time">' + guest.time + '</span>');
  card.append('<span class="items">' + items + '</span>');
  return card;
}

function render() {
  $('#house').empty();
  [2, 1].forEach(function (floorNumber) {
    const floor = $('<div class="floor"></div>').attr('data-floor', floorNumber);
    party.forEach(function (room) {
      if (room.floor !== floorNumber) return;
      const roomBox = $('<div class="room"></div>')
        .attr({ 'data-room': room.id, 'data-title': room.name });
      const list = $('<div class="guests"></div>');
      roomBox.append('<h3>' + room.name + '</h3>').append(list);
      room.guests.forEach(function (guest) {
        list.append(makeCard(guest));
      });
      floor.append(roomBox);
    });
    $('#house').append(floor);
  });
}

const cases = [
  { title: 'Who is in the hall?',
    run: function () {
      return $('.room[data-room="hall"] .guest');
    } },

  { title: 'Who is dressed in yellow or purple?',
    run: function () {
      return $('.guest.yellow, .guest.purple');
    } },

  { title: 'Which AITU students are upstairs?',
    run: function () {
      return $('.floor[data-floor="2"] .guest.aitu');
    } },

  { title: 'Who has glasses or a bag?',
    run: function () {
      return $('.guest.has-glasses, .guest.has-bag');
    } },

  { title: 'Who came with nothing at all?',
    run: function () {
      return $('.guest:not(:has(.item))');
    } },

  { title: 'Who has a phone but no bag?',
    run: function () {
      return $('.guest.has-phone:not(.has-bag)');
    } },

  { title: 'Who arrived between 20:30 and 21:00, both included?',
    run: function () {
      return $('.guest').filter(function () {
        return $(this).data('min') >= 1230 && $(this).data('min') <= 1260;
      });
    } },

  { title: 'Who arrived after 21:00 and is not an AITU student?',
    run: function () {
      return $('.guest:not(.aitu)').filter(function () {
        return $(this).data('min') > 1260;
      });
    } },

  { title: 'Who stands right next to Askar?',
    run: function () {
      return $('.guest[data-name="Askar"]').prev().add($('.guest[data-name="Askar"]').next());
    } },

  { title: 'Who stands last in each room?',
    run: function () {
      return $('.guest:last-child');
    } },

  { title: 'Who stands third in each room?',
    run: function () {
      return $('.guest:nth-child(3)');
    } },

  { title: 'Who stands after Timur in his room?',
    run: function () {
      return $('.guest[data-name="Timur"]').nextAll();
    } },

  { title: 'Who stands right before someone in black?',
    run: function () {
      return $('.guest.black').prev();
    } },

  { title: 'In which room is Aruzhan?',
    run: function () {
      return $('.guest[data-name="Aruzhan"]').closest('.room');
    } },

  { title: 'Which rooms have fewer than 6 guests?',
    run: function () {
      return $('.room').filter(function () {
        return $(this).find('.guest').length < 6;
      });
    } },

  { title: 'In which rooms does somebody have a cup, but nobody wears glasses?',
    run: function () {
      return $('.room:has(.has-cup):not(:has(.has-glasses))');
    } },

  { title: 'Who came first to each room?',
    run: function () {
      return $('.guest').filter(function () {
        const time = $(this).data('min');
        return $(this).siblings().filter(function () {
          return $(this).data('min') < time;
        }).length === 0;
      });
    } },

  { title: 'Miras comes and stands between Askar and Inkar',
    jump: false,
    run: function () {
      return makeCard(miras).hide().insertAfter('.guest[data-name="Askar"]').fadeIn(1000);
    } },

  { title: 'Natasha goes home',
    jump: false,
    run: function () {
      return $('.guest[data-name="Natasha"]').fadeOut(1000, function () {
        $(this).remove();
      });
    } },

  { title: 'Who took the cake?',
    run: function () {
      return $('.floor[data-floor="1"] .guest.has-crumbs:not(.has-cup)')
        .filter(function () {
          return $(this).data('min') > 1260 && $(this).data('min') < 1290;
        })
        .filter(function () {
          return $(this).prev().add($(this).next()).filter('.aitu').length > 0;
        });
    } }
];

function runCase(index) {
  render();
  const found = cases[index].run();
  const names = found.map(function () {
    return $(this).data('name') || $(this).data('title');
  }).get();

  found.addClass('found');
  if (cases[index].jump !== false) {
    found.filter('.guest').animate({ top: -14 }, 150).animate({ top: 0 }, 150);
  }

  $('#result').text('Case ' + (index + 1) + ': ' + cases[index].title +
    '  →  ' + names.length + ' found: ' + names.join(', '));
}

$(function () {
  render();
  cases.forEach(function (item, index) {
    $('<button></button>')
      .text((index + 1) + '. ' + item.title)
      .on('click', function () { runCase(index); })
      .appendTo('#cases');
  });
});