CKEDITOR.plugins.add('cention_emoji', {
	requires: 'dialog',
	lang: 'en,en-au,en-ca,en-gb,fi,fr,fr-ca,ms,nb,no,sv,zh,zh-cn',
	icons: 'cention_emoji',
	hidpi: true,
	autoConvert: true,
	init: function(editor) {
		var emojified = {
			smile: '🙂',
			open_mouth: '😮',
			scream: '😱',
			smirk: '😏',
			grinning: '😀',
			stuck_out_tongue_closed_eyes: '😝',
			stuck_out_tongue_winking_eye: '😜',
			rage: '😡',
			frowning: '😦',
			sob: '😭',
			kissing_heart: '😘',
			wink: '😉',
			pensive: '😔',
			confounded: '😖',
			flushed: '😳',
			relaxed: '☺',
			mask: '😷',
			heart: '❤',
			broken_heart: '💔'
		};
		var contentChanged = false;
		var self = this;
		var timer = setInterval(function() {
			if(contentChanged) {
				if(!self.autoConvert) {
					return;
				}
				if(window.emojify) {
					window.emojify.run(editor.document.$.body,
						function(emoji, name) {
						if(emojified[name]) {
							var span = document.createElement('span');
							span.innerHTML = emojified[name];
							return span;
						}
					});
					contentChanged = false;
				}
			}
		}, 888);
		// load the emojify library
		// callback complete must be there to un-busy the cursor busy pointer.
		// Seem like ckeditor bug.
		CKEDITOR.scriptLoader.load(this.path+'emojify/emojify.js',
			function(ok) {}, null, true);
		editor.on('change', function(e) {
			contentChanged = true;
		});
		editor.on('destroy', function(e) {
			//console.debug("ckeditor is being DESTROYED");
			clearInterval(timer);
		});
		editor.addCommand('cention_emoji', new CKEDITOR.dialogCommand('cention_emoji', {
			allowedContent: 'img[alt,height,!src,title,width]',
			requiredContent: 'img'
		}));
		editor.ui.addButton && editor.ui.addButton('Cention_emoji', {
			label: editor.lang.cention_emoji.toolbar,
			command: 'cention_emoji',
			toolbar: 'insert,50'
		});
		CKEDITOR.dialog.add('cention_emoji', this.path + 'dialogs/cention_emoji.js');
	}
});

CKEDITOR.config.people = [
	'😄','🙂','😆','😊','😃','☺','😏','😍','😘','😚','😳','😌','😆','😁','😉','😜',
	'😝','😀','😗','😙','😛','😴','😟','😦','😧','😮','😬','😕','😯','😑','😒','😅',
	'😓','😥','😫','😔','😞','😖','😨','😰','😣','😢','😭','😂','😵','😱','😫','😠',
	'😡','😤','😪','😋','😷','😎','😵','👿','😈','😐','😶','😇','👽','💛','💙','💜',
	'❤','💚','💔','💓','💗','💕','💞','💘','💖','✨','⭐','🌟','💫','💥','💥','💢',
	'❗','❓','❕','❔','💤','💨','💦','🎶','🎵','🔥','💩','💩','💩','👍','👍','👎','👎',
	'👌','👊','👊','✊','✌','👋','✋','✋','👐','☝','👇','👈','👉','🙌','🙏','👆','👏',
	'💪','🤘 ','🏃','🏃','👫','👪','👬','👭','💃','👯','🙆','🙅','💁','🙋','👰','🙎','🙍',
	'🙇','💏','💑','💆','💇','💅','👦','👧','👩','👨','👶','👵','👴','👱','👲','👳',
	'👷','👮','👼','👸','😺','😸','😻','😽','😼','🙀','😿','😹','😾','👹','👺','🙈',
	'🙉','🙊','💂','💀','👣','👄','💋','💧','👂','👀','👃','👅','💌','👤','👥','💬','💭'
];

CKEDITOR.config.people_desc = [
	'Smile','Simple smile','Laughing','Blush','Smiley','Relaxed','Smirk',
	'Heart eyes','Kissing heart','Kissing closed eyes','Flushed','Relieved',
	'Satisfied','Grin','Wink','Stuck out tongue winking eye',
	'Stuck out tongue closed eyes','Grinning','Kissing','Kissing smiling eyes',
	'Stuck out tongue','Sleeping','Worried','Frowning','Anguished','Open mouth',
	'Grimacing','Confused','Hushed','Expressionless','Unamused','Sweat smile',
	'Sweat','Disappointed relieved','Weary','Pensive','Disappointed','Confounded',
	'Fearful','Cold sweat','Persevere','Cry','Sob','Joy','Astonished','Scream',
	'Tired face','Angry','Rage','Triumph','Sleepy','Yum','Mask','Sunglasses',
	'Dizzy face','Imp','Smiling imp','Neutral face','No mouth','Innocent','Alien',
	'Yellow heart','Blue heart','Purple heart','Heart','Green heart','Broken heart',
	'Heartbeat','Heartpulse','Two hearts','Revolving hearts','Cupid','Sparkling heart',
	'Sparkles','Star','Star2','Dizzy','Boom','Collision','Anger','Exclamation',
	'Question','Grey exclamation','Grey question','Zzz','Dash','Sweat drops','Notes',
	'Musical note','Fire','Hankey','Poop','Shit','+1','Thumbsup','-1','Thumbsdown',
	'Ok hand','Punch','Facepunch','Fist','V','Wave','Hand','Raised hand','Open hands',
	'Point up','Point down','Point left','Point right','Raised hands','Pray',
	'Point up 2','Clap','Muscle','Metal','Runner','Running','Couple','Family',
	'Two men holding hands','Two women holding hands','Dancer','Dancers','Ok woman',
	'No good','Information desk person','Raising hand','Bride with veil',
	'Person with pouting face','Person frowning','Bow','Couplekiss','Couple with heart',
	'Massage','Haircut','Nail care','Boy','Girl','Woman','Man','Baby','Older woman',
	'Older man','Person with blond hair','Man with gua pi mao','Man with turban',
	'Construction worker','Cop','Angel','Princess','Smiley cat','Smile cat',
	'Heart eyes cat','Kissing cat','Smirk cat','Scream cat','Crying cat face',
	'Joy cat','Pouting cat','Japanese ogre','Japanese goblin','See no evil',
	'Hear no evil','Speak no evil','Guardsman','Skull','Feet','Lips','Kiss',
	'Droplet','Ear','Eyes','Nose','Tongue','Love letter','Bust in silhouette',
	'Busts in silhouette','Speech balloon','Thought balloon'
];

CKEDITOR.config.nature = [
	'☀','☔','☁','❄','⛄','⚡','🌪','🌫','🌊','🐱','🐶','🐭','🐹','🐰','🐺','🐸','🐯',
	'🐨','🐻','🐷','🐽','🐮','🐗','🐵','🐒','🐴','🐎','🐫','🐑','🐘','🐼','🐍','🐦',
	'🐤','🐥','🐣','🐔','🐧','🐢','🐛','🐝','🐜','🐞','🐌','🐙','🐠','🐟','🐳','🐋',
	'🐬','🐄','🐏','🐀','🐃','🐅','🐇','🐉','🐐','🐓','🐕','🐖','🐁','🐂','🐲','🐡',
	'🐊','🐪','🐆','🐈','🐩','🐾','💐','🌸','🌷','🍀','🌹','🌻','🌺','🍁','🍃','🍂',
	'🌿','🍄','🌵','🌴','🌲','🌳','🌰','🌱','🌼','🌾','🐚','🌐','🌞','🌝','🌚','🌑','🌒',
	'🌓','🌖','🌕','🌖','🌗','🌔','🌜','🌛','🌙','🌍','🌎','🌏','🌋','🌌','⛅'
];

CKEDITOR.config.nature_desc = [
	'Sunny','Umbrella','Cloud','Snowflake','Snowman','Zap','Cyclone','Foggy',
	'Ocean','Cat','Dog','Mouse','Hamster','Rabbit','Wolf','Frog','Tiger','Koala',
	'Bear','Pig','Pig nose','Cow','Boar','Monkey face','Monkey','Horse','Racehorse',
	'Camel','Sheep','Elephant','Panda face','Snake','Bird','Baby chick','Hatched chick',
	'Hatching chick','Chicken','Penguin','Turtle','Bug','Honeybee','Ant','Beetle',
	'Snail','Octopus','Tropical fish','Fish','Whale','Whale2','Dolphin','Cow2',
	'Ram','Rat','Water buffalo','Tiger2','Rabbit2','Dragon','Goat','Rooster',
	'Dog2','Pig2','Mouse2','Ox','Dragon face','Blowfish','Crocodile','Dromedary camel',
	'Leopard','Cat2','Poodle','Paw prints','Bouquet','Cherry blossom','Tulip',
	'Four leaf clover','Rose','Sunflower','Hibiscus','Maple leaf','Leaves','Fallen leaf',
	'Herb','Mushroom','Cactus','Palm tree','Evergreen tree','Deciduous tree','Chestnut',
	'Seedling','Blossom','Ear of rice','Shell','Globe with meridians','Sun with face',
	'Full moon with face','New moon with face','New moon','Waxing crescent moon',
	'First quarter moon','Waxing gibbous moon','Full moon','Waning gibbous moon',
	'Last quarter moon','Waning crescent moon','Last quarter moon with face',
	'First quarter moon with face','Crescent moon','Earth africa','Earth americas',
	'Earth asia','Volcano','Milky way','Partly sunny'
];

CKEDITOR.config.object = [
	'🎍','💝','🎎','🎒','🎓','🎏','🎆','🎇','🎐','🎑','🎃','👻','🎅','🎄','🎁','🔔','🔕',
	'🎋','🎉','🎊','🎈','🔮','💿','📀','💾','📷','📹','🎥','💻','📺','📱','☎','☎','📞',
	'📟','📠','💽','📼','🔉','🔈','🔇','📢','📣','⌛','⏳','⏰','⌚','📻','📡','➿','🔍',
	'🔎','🔓','🔒 ','🔏','🔐','🔑','💡','🔦','🔆','🔅','🔌','🔋','📲','📧','📫','📮',
	'🛀','🛁','🚿','🚽','🔧','🔩','🔨','💺','💰','💴','💵','💷','💶','💳','💸','📧','📥',
	'📤','✉','📨','📯','📪','📬','📭','📦','🚪','🚬','💣','🔫','🔪','💊','💉','📄','📃',
	'📑','📊','📈','📉','📜','📋','📆','📅','📇','📁','📂','✂','📌','📎','✒','✏','📏',
	'📐','📕','📗','📘','📙','📓','📔','📒','📚','🔖','📛','🔬','🔭','📰','🏈','🏀','⚽',
	'⚾','🎾','🎱','🏉','🎳','⛳','🚵','🚴','🏇','🏂','🏊','🏄','⛷','♠','♥','♣','♦',
	'💎','💍','🏆','🎼','🎹','🎻','🎮','🃏','🎴','🎲','🀄','🎬','📝','📝','📖','🎨','🎤',
	'🎧','🎺','🎷','🎸','👟','👡','👠','💄','👢','👕','👕','👔','👚','👗','🎽','👖','👘',
	'👙','🎀','🎩','👑','👒','👞','🌂','💼','👜','👝','👛','👓','🎣','☕','🍵','🍶','🍼',
	'🍺','🍻','🍸','🍹','🍷','🍴','🍕','🍔','🍟','🍗','🍖','🍝','🍛','🍤','🍱','🍣','🍥',
	'🍙','🍘','🍚','🍜','🍲','🍢','🍡','🍳','🍞','🍩','🍮','🍦','🍨','🍧','🎂','🍰','🍪',
	'🍫','🍬','🍭','🍯','🍎','🍏','🍊','🍋','🍒','🍇','🍉','🍓','🍑','🍈','🍌','🍐','🍍',
	'🍠','🍆','🍅','🌽'
];

CKEDITOR.config.object_desc = [
	'Bamboo','Gift heart','Dolls','School satchel','Mortar board','Flags','Fireworks',
	'Sparkler','Wind chime','Rice scene','Jack o lantern','Ghost','Santa','Christmas tree',
	'Gift','Bell','No bell','Tanabata tree','Tada','Confetti ball','Balloon','Crystal ball',
	'Cd','Dvd','Floppy disk','Camera','Video camera','Movie camera','Computer','Tv',
	'Iphone','Phone','Telephone','Telephone receiver','Pager','Fax','Minidisc','Vhs',
	'Sound','Speaker','Mute','Loudspeaker','Mega','Hourglass','Hourglass flowing sand',
	'Alarm clock','Watch','Radio','Satellite','Loop','Mag','Mag right','Unlock','Lock',
	'Lock with ink pen','Closed lock with key','Key','Bulb','Flashlight','High brightness',
	'Low brightness','Electric plug','Battery','Calling','Email','Mailbox','Postbox',
	'Bath','Bathtub','Shower','Toilet','Wrench','Nut and bolt','Hammer','Seat','Moneybag',
	'Yen','Dollar','Pound','Euro','Credit card','Money with wings','E-Mail','Inbox tray',
	'Outbox tray','Envelope','Incoming envelope','Postal horn','Mailbox closed',
	'Mailbox with mail','Mailbox with no mail','Package','Door','Smoking','Bomb','Gun',
	'Hocho','Pill','Syringe','Page facing up','Page with curl','Bookmark tabs','Bar chart',
	'Chart with upwards trend','Chart with downwards trend','Scroll','Clipboard','Calendar',
	'Date','Card index','File folder','Open file folder','Scissors','Pushpin','Paperclip',
	'Black nib','Pencil2','Straight ruler','Triangular ruler','Closed book','Green book',
	'Blue book','Orange book','Notebook','Notebook with decorative cover','Ledger','Books',
	'Bookmark','Name badge','Microscope','Telescope','Newspaper','Football','Basketball',
	'Soccer','Baseball','Tennis','8ball','Rugby football','Bowling','Golf','Mountain bicyclist',
	'Bicyclist','Horse racing','Snowboarder','Swimmer','Surfer','Ski','Spades','Hearts',
	'Clubs','Diamonds','Gem','Ring','Trophy','Musical score','Musical keyboard','Violin',
	'Video game','Black joker','Flower playing cards','Game die','Mahjong','Clapper',
	'Memo','Pencil','Book','Art','Microphone','Headphones','Trumpet','Saxophone','Guitar',
	'Shoe','Sandal','High heel','Lipstick','Boot','Shirt','Tshirt','Necktie','Womans clothes',
	'Dress','Running shirt with sash','Jeans','Kimono','Bikini','Ribbon','Tophat','Crown',
	'Womans hat','Mans shoe','Closed umbrella','Briefcase','Handbag','Pouch','Purse',
	'Eyeglasses','Fishing pole and fish','Coffee','Tea','Sake','Baby bottle','Beer',
	'Beers','Cocktail','Tropical drink','Wine glass','Fork and knife','Pizza','Hamburger',
	'Fries','Poultry leg','Meat on bone','Spaghetti','Curry','Fried shrimp','Bento',
	'Sushi','Fish cake','Rice ball','Rice cracker','Rice','Ramen','Stew','Oden','Dango',
	'Egg','Bread','Doughnut','Custard','Icecream','Ice cream','Shaved ice','Birthday',
	'Cake','Cookie','Chocolate bar','Candy','Lollipop','Honey pot','Apple','Green apple',
	'Tangerine','Lemon','Cherries','Grapes','Watermelon','Strawberry','Peach','Melon',
	'Banana','Pear','Pineapple','Sweet potato','Eggplant','Tomato','Corn'
];

CKEDITOR.config.place = [
	'🏠','🏡','🏫','🏢','🏣','🏥','🏦','🏪','🏩','🏨','💒','⛪','🏬','🏤','🌇','🌆','🏯',
	'🏰','⛺','🏭','🗼','🗾','🗻','🌄','🌅','🌠','🗽','🌉','🎠','🌈','🎡','⛲','🎢','🚢',
	'🚤','⛵','⛵','🚣','⚓','🚀','✈','🚁','🚂','🚊','🚞','🚲','🚡','🚟','🚠','🚜','🚙',
	'🚘','🚗','🚗','🚕','🚖','🚛','🚌','🚍','🚨','🚓','🚔','🚒','🚑','🚐','🚚','🚋','🚉',
	'🚆','🚆','🚅','🚈','🚝','🚃','🚎','🎫','⛽','🚦','🚥','⚠','🚧','🔰','🏧','🎰','🚏','💈',
	'♨','🏁','🎌','🏮','🗿','🎪','🎭','📍','🚩','🇯🇵','🇰🇷','🇨🇳','🇺🇸','🇫🇷','🇪🇸',
	'🇮🇹','🇷🇺','🇬🇧','🇬🇧','🇩🇪'
];

CKEDITOR.config.place_desc = [
	'House','House with garden','School','Office','Post office','Hospital','Bank',
	'Convenience store','Love hotel','Hotel','Wedding','Church','Department store',
	'European post office','City sunrise','City sunset','Japanese castle','European castle',
	'Tent','Factory','Tokyo tower','Japan','Mount fuji','Sunrise over mountains',
	'Sunrise','Stars','Statue of liberty','Bridge at night','Carousel horse',
	'Rainbow','Ferris wheel','Fountain','Roller coaster','Ship','Speedboat','Boat',
	'Sailboat','Rowboat','Anchor','Rocket','Airplane','Helicopter','Steam locomotive',
	'Tram','Mountain railway','Bike','Aerial tramway','Suspension railway','Mountain cableway',
	'Tractor','Blue car','Oncoming automobile','Car','Red car','Taxi','Oncoming taxi',
	'Articulated lorry','Bus','Oncoming bus','Rotating light','Police car','Oncoming police car',
	'Fire engine','Ambulance','Minibus','Truck','Train','Station','Train2','Bullettrain front',
	'Bullettrain side','Light rail','Monorail','Railway car','Trolleybus','Ticket','Fuelpump',
	'Vertical traffic light','Traffic light','Warning','Construction','Beginner','Atm',
	'Slot machine','Busstop','Barber','Hotsprings','Checkered flag','Crossed flags',
	'Izakaya lantern','Moyai','Circus tent','Performing arts','Round pushpin',
	'Triangular flag on post','Jp','Kr','Cn','Us','Fr','Es','It','Ru','Gb','Uk','De'
];

CKEDITOR.config.symbol = [
	'1⃣','2⃣','3⃣','4⃣','5⃣','6⃣','7⃣','8⃣','9⃣','🔟','🔢','0⃣','#⃣','🔣','◀','⬇',
	'▶','⬅','🔠','🔡','🔤','↙','↘','➡','⬆','↖','↗','⏬','⏫','🔽','⤵','⤴','↩','↪','↔',
	'↕','🔼','🔃','🔄','⏪','⏩','ℹ','🆗','🔀','🔁','🔂','🆕','🆙','🆒','🆓','🆖','🎦',
	'🈁','📶','🈹','🈴','🈺','🈯','🈷','🈶','🈵','🈚','🈸','🈳','🈲','🈂','🚻','🚹',
	'🚺','🚼','🚭','🅿','♿','🚇','🛄','🉑','🚾','🚰','🚮','㊙','㊗','Ⓜ','🛂','🛅','🛃',
	'🉐','🆑','🆘','🆔','🚫','🔞','📵','🚯','🚱','🚳','🚷','🚸','⛔','✳','❇','✴','💟',
	'🆚','📳','📴','💹','💱','♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓','⛎',
	'🔯','❎','🅰','🅱','🆎','🅾','💠','♻','🔚','🔙','🔛','🔜','🕐','🕜','🕙','🕥',
	'🕚','🕦','🕛','🕧','🕑','🕝','🕒','🕞','🕓','🕟','🕔','🕠','🕕','🕡','🕖','🕢','🕗',
	'🕣','🕘','🕤','💲','©','®','™','❌','❗','‼','⁉','⭕','✖','➕','➖','➗','💮','💯',
	'✔','☑','🔘','🔗','➰','〰','〽','🔱','▪','▫','◾','◽','◼','◻','⬛','⬜','✅',
	'🔲','🔳','⚫','⚪','🔴','🔵','🔷','🔶','🔹','🔸','🔺','🔻'
];

CKEDITOR.config.symbol_desc = [
	'One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Keycap ten',
	'1234','Zero','Hash','Symbols','Arrow backward','Arrow down','Arrow forward',
	'Arrow left','Capital abcd','Abcd','Abc','Arrow lower left','Arrow lower right',
	'Arrow right','Arrow up','Arrow upper left','Arrow upper right','Arrow double down',
	'Arrow double up','Arrow down small','Arrow heading down','Arrow heading up',
	'Leftwards arrow with hook','Arrow right hook','Left right arrow','Arrow up down',
	'Arrow up small','Arrows clockwise','Arrows counterclockwise','Rewind',
	'Fast forward','Information source','Ok','Twisted rightwards arrows','Repeat',
	'Repeat one','New','Up','Cool','Free','Ng','Cinema','Koko','Signal strength',
	'U5272','U5408','U55b6','U6307','U6708','U6709','U6e80','U7121','U7533','U7a7a',
	'U7981','Sa','Restroom','Mens','Womens','Baby symbol','No smoking','Parking',
	'Wheelchair','Metro','Baggage claim','Accept','Wc','Potable water',
	'Put litter in its place','Secret','Congratulations','M','Passport control',
	'Left luggage','Customs','Ideograph advantage','Cl','Sos','Id','No entry sign',
	'Underage','No mobile phones','Do not litter','Non-Potable water','No bicycles',
	'No pedestrians','Children crossing','No entry','Eight spoked asterisk','Sparkle',
	'Eight pointed black star','Heart decoration','Vs','Vibration mode','Mobile phone off',
	'Chart','Currency exchange','Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra',
	'Scorpius','Sagittarius','Capricorn','Aquarius','Pisces','Ophiuchus','Six pointed star',
	'Negative squared cross mark','A','B','Ab','O2','Diamond shape with a dot inside',
	'Recycle','End','Back','On','Soon','Clock1','Clock130','Clock10','Clock1030',
	'Clock11','Clock1130','Clock12','Clock1230','Clock2','Clock230','Clock3',
	'Clock330','Clock4','Clock430','Clock5','Clock530','Clock6','Clock630','Clock7',
	'Clock730','Clock8','Clock830','Clock9','Clock930','Heavy dollar sign','Copyright',
	'Registered','Tm','X','Heavy exclamation mark','Bangbang','Interrobang','O',
	'Heavy multiplication x','Heavy plus sign','Heavy minus sign','Heavy division sign',
	'White flower','100','Heavy check mark','Ballot box with check','Radio button',
	'Link','Curly loop','Wavy dash','Part alternation mark','Trident','Black small square',
	'White small square','Black medium small square','White medium small square',
	'Black medium square','White medium square','Black large square','White large square',
	'White check mark','Black square button','White square button','Black circle',
	'White circle','Red circle','Large blue circle','Large blue diamond','Large orange diamond',
	'Small blue diamond','Small orange diamond','Small red triangle','Small red triangle down'
];
