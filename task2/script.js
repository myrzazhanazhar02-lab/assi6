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

  const inner = $('<div class="inner"></div>');
  inner.append('<img alt="' + guest.name + '" src="https://api.dicebear.com/9.x/open-peeps/svg?seed=' + guest.name + '">');
  if (guest.aitu) {
    inner.append('<i class="badge">🎓</i>');
  }
  inner.append('<span class="name">' + guest.name + '</span>');
  inner.append('<span class="time">' + guest.time + '</span>');
  inner.append('<span class="items">' + items + '</span>');
  card.append(inner);
  return card;
}

function render() {
  killCards();
  $('#house').empty();
  [2, 1].forEach(function (floorNumber) {
    const floor = $('<div class="floor"></div>').attr('data-floor', floorNumber);
    party.forEach(function (room) {
      if (room.floor !== floorNumber) return;
      const roomBox = $('<div class="room"></div>')
        .attr({ 'data-room': room.id, 'data-title': room.name });
      const list = $('<div class="guests"></div>');
      const head = $('<div class="room-head"></div>')
        .append('<h3>' + room.name + '</h3>')
        .append('<button class="sort">Sort by time</button>');
      roomBox.append(head).append(list);
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
      return $('.guest[data-name="Natasha"]').addClass('gone').fadeOut(1000, function () {
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
    found.filter('.guest').find('.inner').animate({ top: -14 }, 150).animate({ top: 0 }, 150);
  }
  spotlight(found);

  $('#result').text('Case ' + (index + 1) + ': ' + cases[index].title +
    '  →  ' + names.length + ' found: ' + names.join(', '));
}

function spotlight(found) {
  const bright = found.filter('.guest').add(found.filter('.room').find('.guest'));
  $('.guest').not(bright).fadeTo(300, 0.2);
}

function clearSpotlight() {
  $('.guest').not('.leaving, .arriving, .gone').stop(true).fadeTo(300, 1);
  $('.found').removeClass('found');
  $('#result').text('Cleared. Everybody is bright again.');
}

let current = null;
let openCards = [];

function killCard(s) {
  s.anim.stop(true);
  s.card.remove();
  openCards = openCards.filter(function (x) { return x !== s; });
  if (current === s) current = null;
}

function killCards() {
  openCards.slice().forEach(killCard);
  current = null;
  $('.flyer').remove();
}

function joinWords(list) {
  if (list.length < 2) return list[0];
  return list.slice(0, -1).join(', ') + ' and ' + list[list.length - 1];
}

function buildCard(guest) {
  const words = { phone: 'a phone', glasses: 'glasses', bag: 'a bag', cup: 'a cup', crumbs: 'cake crumbs' };
  const room = guest.closest('.room');
  const things = String(guest.attr('data-things')).split(',').filter(Boolean);

  let html = '<h4>' + guest.attr('data-name') + '</h4><ul>';
  html += '<li>Came at ' + guest.attr('data-time') + '</li>';
  html += '<li>' + (guest.hasClass('aitu') ? 'AITU student' : 'Not an AITU student') + '</li>';
  html += '<li>' + (things.length ? 'Has ' + joinWords(things.map(function (t) { return words[t]; })) : 'Came with nothing') + '</li>';
  html += '<li>Wears ' + guest.attr('data-color') + ' clothes</li>';
  html += '<li>Now in the ' + room.attr('data-title').toLowerCase() + '</li>';
  html += '</ul>';

  $('.room').not(room).each(function () {
    html += '<button class="move" data-room="' + $(this).attr('data-room') + '">Move to the ' +
      $(this).attr('data-title').toLowerCase() + '</button>';
  });

  return $('<div class="card"></div>')
    .css({ visibility: 'hidden', left: 0, top: 0, width: 244, height: 'auto' })
    .append('<div class="card-body">' + html + '</div>')
    .appendTo('body');
}

function placeCard(s) {
  const a = s.avatar.offset();
  const aw = s.avatar.outerWidth();
  const ah = s.avatar.outerHeight();
  const win = $(window);
  let fullLeft = a.left + aw / 2 - s.fw / 2;
  let fullTop = a.top + ah / 2 - s.fh / 2;
  fullLeft = Math.max(win.scrollLeft() + 8, Math.min(fullLeft, win.scrollLeft() + win.width() - s.fw - 8));
  fullTop = Math.max(win.scrollTop() + 8, Math.min(fullTop, win.scrollTop() + win.height() - s.fh - 8));
  s.card.css({
    left: a.left + (fullLeft - a.left) * s.t,
    top: a.top + (fullTop - a.top) * s.t,
    width: aw + (s.fw - aw) * s.t,
    height: ah + (s.fh - ah) * s.t,
    visibility: 'visible'
  });
  s.card.find('.card-body').css('opacity', s.t);
}

function animateCard(s, from, to, ms, done) {
  s.anim = $({ t: from }).animate({ t: to }, {
    duration: ms,
    step: function (now) {
      s.t = now;
      placeCard(s);
    },
    complete: function () {
      s.t = to;
      placeCard(s);
      if (done) done();
    }
  });
}

function openCardFor(guest) {
  closeCard();
  const s = { guest: guest, avatar: guest.find('img'), t: 0, fw: 244 };
  s.card = buildCard(guest);
  s.fh = s.card.outerHeight();
  openCards.push(s);
  current = s;
  animateCard(s, 0, 1, 350);
}

function closeCard() {
  if (!current) return;
  const s = current;
  current = null;
  s.anim.stop(true);
  s.card.addClass('closing');
  animateCard(s, s.t, 0, 250, function () { killCard(s); });
}

function moveInArray(name, roomId) {
  let moved = null;
  party.forEach(function (room) {
    const i = room.guests.findIndex(function (g) { return g.name === name; });
    if (i > -1) moved = room.guests.splice(i, 1)[0];
  });
  if (moved) {
    party.find(function (room) { return room.id === roomId; }).guests.push(moved);
  }
}

function moveGuest(card, roomId) {
  const target = $('.room[data-room="' + roomId + '"]');
  const oldRoom = card.closest('.room');
  if (!target.length || card.is('.leaving, .arriving') || target[0] === oldRoom[0]) return;

  moveInArray(card.attr('data-name'), roomId);

  const from = card.offset();
  const flyer = card.clone().addClass('flyer').css({ left: from.left, top: from.top }).appendTo('body');
  flyer.find('.inner').css('top', 0);

  const moved = card.clone().addClass('arriving')
    .css({ left: 0, top: 0, width: 0, marginRight: 0, overflow: 'hidden', visibility: 'hidden' })
    .appendTo(target.find('.guests'));
  moved.find('.inner').css('top', 0);

  const oldOrig = oldRoom.data('orig');
  if (oldOrig) {
    oldRoom.data('orig', oldOrig.filter(function (el) { return el !== card[0]; }));
  }
  const newOrig = target.data('orig');
  if (newOrig) newOrig.push(moved[0]);

  let waiting = 2;
  function landed() {
    waiting--;
    if (waiting > 0) return;
    flyer.remove();
    moved.removeClass('arriving').css('visibility', '');
  }

  card.stop('slide', true).addClass('leaving')
    .css({ visibility: 'hidden', overflow: 'hidden' })
    .animate({ width: 0, marginRight: 0 }, 800, function () { $(this).remove(); });

  moved.animate({ width: 68, marginRight: 6 }, 800, function () {
    moved.css({ width: '', marginRight: '', overflow: '', left: '', top: '' });
    landed();
  });

  $({ t: 0 }).animate({ t: 1 }, {
    duration: 900,
    step: function (t) {
      const to = moved.offset();
      flyer.css({
        left: from.left + (to.left - from.left) * t,
        top: from.top + (to.top - from.top) * t
      });
    },
    complete: landed
  });
}

function toggleSort(room) {
  const list = room.find('.guests');
  const cards = list.children('.guest').not('.leaving, .arriving');
  cards.stop('slide', true);

  const before = new Map();
  cards.each(function () { before.set(this, $(this).offset()); });

  const sorted = !room.data('sorted');
  room.data('sorted', sorted);

  let order;
  if (sorted) {
    room.data('orig', cards.get());
    order = cards.get().sort(function (a, b) {
      return $(a).data('min') - $(b).data('min');
    });
  } else {
    const orig = (room.data('orig') || []).filter(function (el) { return cards.index(el) > -1; });
    const rest = cards.get().filter(function (el) { return orig.indexOf(el) === -1; });
    order = orig.concat(rest);
  }

  cards.css({ left: 0, top: 0 });
  order.forEach(function (el) { list.append(el); });
  list.append(list.children('.arriving'));

  order.forEach(function (el) {
    const card = $(el);
    const start = before.get(el);
    const end = card.offset();
    card.css({ left: start.left - end.left, top: start.top - end.top })
      .animate({ left: 0, top: 0 }, { duration: 600, queue: 'slide' })
      .dequeue('slide');
  });
}

$(document).on('click', function (e) {
  const target = $(e.target);

  if (target.closest('.card').length) {
    const button = target.closest('button.move');
    if (button.length && current && target.closest('.card')[0] === current.card[0]) {
      const guest = current.guest;
      const roomId = button.attr('data-room');
      killCard(current);
      moveGuest(guest, roomId);
    }
    return;
  }

  const guest = target.closest('.guest');
  if (guest.length && !guest.is('.leaving, .arriving, .flyer')) {
    if (current && current.guest[0] === guest[0]) {
      closeCard();
    } else {
      openCardFor(guest);
    }
    return;
  }

  closeCard();
});

$(document).on('keydown', function (e) {
  if (e.key === 'Escape') closeCard();
});

$('#house').on('click', '.sort', function () {
  toggleSort($(this).closest('.room'));
});

$('#clear').on('click', clearSpotlight);

$(function () {
  render();
  cases.forEach(function (item, index) {
    $('<button></button>')
      .text((index + 1) + '. ' + item.title)
      .on('click', function () { runCase(index); })
      .appendTo('#cases');
  });
});