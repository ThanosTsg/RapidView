function RapidViewer(options){

	let defaultParameters = {
		item_width: 300,
		max_items: 3,
        min_items: 1,
        break: 900
	}

	options = {...defaultParameters, ...options};

	let _this = this;
	let paired_items;
	let current_stigma = 0;
	let break_size = window.matchMedia("(max-width: "+options.break+"px)");

	if(break_size.matches) {
		paired_items = options.min_items;
	}else{
		paired_items = options.max_items;
	}

	let cw = document.getElementById('groups_master').offsetWidth;
	let giw = options.item_width * paired_items;
	let init_pos = (cw+(cw/2)) - (giw/2);

	this.removeAllAttr = function(){

		this.toggleBtns(0);

		let question_groups = document.querySelectorAll('.group_section');

		for (let i = 0; i < question_groups.length; i++) {
			let question_items = document.getElementsByClassName('group_container')[i].children;

			if(question_groups[i].hasAttribute('style'))
				question_groups[i].removeAttribute("style");

			if(question_groups[i].hasAttribute('data-group'))
				question_groups[i].removeAttribute("data-group");

			if(question_groups[i].hasAttribute('data-coord'))
				question_groups[i].removeAttribute("data-coord");

			for (let k = 0; k < question_items.length; k++) {
				if(question_items[k].hasAttribute('style'))
					question_items[k].removeAttribute("style");

				if(question_items[k].hasAttribute('data-group'))
					question_items[k].removeAttribute("data-group");

				if(question_items[k].hasAttribute('data-coord'))
					question_items[k].removeAttribute("data-coord");
			}
		}
	}

	this.init_setup = function(){ 

		setTimeout(function(){ document.getElementById('groups_master').setAttribute('style','opacity:1;'); }, 400);

		let question_groups = document.querySelectorAll('.group_section');

		for (let i = 0; i < question_groups.length; i++) {

			let question_items = document.getElementsByClassName('group_container')[i].children;

			document.getElementsByClassName('group_container')[i].setAttribute('style','transform: translateX(calc('+(this.itemPos())+'px - '+(cw)+'px));');

			let currently_paired_pos = paired_items;

			question_groups[i].setAttribute('data-group', i);

			question_groups[i].setAttribute('data-coord', ((i+1)*cw));

			question_groups[i].style.flex = "0 0 "+cw+"px";

			let remaining_items = this.groupRemainder(question_items.length);

			let r = 0;

			if(remaining_items == 0){
				question_items[0].style.flex = "0 0 "+options.item_width+"px";
				r = 1;
			}

			let counter = 0;

			for (let k = 0; k < question_items.length - r; k++) {
				question_items[k + r].style.flex = "0 0 "+options.item_width+"px";

				if(currently_paired_pos == k+1){
					question_items[k].style.margin = "0px 1000px 0px 0px";

					question_items[k].setAttribute('data-group', i);
					question_items[k].setAttribute('data-coord', this.itemPos(++counter));

					if( ((k+1)+paired_items) >= question_items.length){
						if(remaining_items != 0)
							question_items[k].setAttribute('data-coord', this.remainderPos(question_items[k].getAttribute('data-coord'), (remaining_items*options.item_width)) );
					}

					currently_paired_pos += paired_items;
				}
			}
		}

		// init

		if(current_stigma == 0){
			this.toggleBtns(0);
			document.getElementsByClassName('group_container')[0].setAttribute('style','transform: translateX(calc('+(this.itemPos())+'px - '+(cw)+'px));');
		}
		// init setup end
	}


	this.itemPos = function(scalar = 0){
		return init_pos - ((scalar*giw)+(scalar*1000));
	}

	this.groupRemainder = function(group_items){
		let remaining = 0;
		if((group_items % paired_items) != 0 )
			remaining = paired_items - (group_items % paired_items);
		return remaining;
	}

	this.remainderPos = function (pos, remaining_width){
		if(pos < 0)
			return ('-'+(Math.abs(pos) - (remaining_width/2)));
		return (pos - (remaining_width/2));
	}

	// navigate 

	this.nextStigma = function(){

		current_stigma+=1;
		let stigma = document.querySelectorAll('[data-group]');

		if(current_stigma > stigma.length-1){
			current_stigma = stigma.length-1;
			return false;
		}

		this.toggleBtns(current_stigma);

		stigma[current_stigma-1].classList.remove("viewed");
		stigma[current_stigma].className += " viewed";

		if(stigma[current_stigma].getAttribute('data-group') != stigma[current_stigma-1].getAttribute('data-group')){
			this.changeView(stigma[current_stigma],document.getElementsByClassName('group_section')[(stigma[current_stigma-1].getAttribute('data-group'))]);
		}else{
			this.changeItem(stigma[current_stigma]);
		}
	}


	this.prevStigma = function(){

		current_stigma-=1;

		if(current_stigma < 0){
			current_stigma = 0;
			return false;
		}

		let stigma = document.querySelectorAll('[data-group]');

		stigma[current_stigma+1].classList.remove("viewed");
		stigma[current_stigma].className += " viewed";

		this.toggleBtns(current_stigma);

		if(stigma[current_stigma].getAttribute('data-group') != stigma[current_stigma+1].getAttribute('data-group')){
			this.changeView(document.getElementsByClassName('group_section')[(stigma[current_stigma].getAttribute('data-group'))],document.getElementsByClassName('group_section')[(stigma[current_stigma+1].getAttribute('data-group'))]);
		}else{
			this.changeItem(stigma[current_stigma]);
		}
	}


	this.changeItem = function(el){
		if(el.classList.contains('group_section')){
			document.getElementsByClassName('group_container')[el.getAttribute('data-group')].setAttribute('style','transform: translateX(calc('+(this.itemPos())+'px - '+(cw)+'px));');
		}else{
			document.getElementsByClassName('group_container')[el.getAttribute('data-group')].setAttribute('style','transform: translateX(calc('+(el.getAttribute('data-coord'))+'px - '+(cw)+'px));');
		}
	}

	this.changeView = function(el, displaced_el){
		displaced_el.setAttribute('style','flex: 0 0 '+cw+'px;transform: translateX( -'+(displaced_el.getAttribute('data-coord'))+'px);');
		el.setAttribute('style','flex: 0 0 '+cw+'px;transform: translateX(calc('+(cw)+'px - '+(el.getAttribute('data-coord'))+'px));');
	}

	this.insertAfter = function(new_el, old_el) {
		new_el.parentNode.insertBefore(new_el, old_el.nextSibling);
	}

	this.add_btn = function(){
		let btn_container_node = document.createElement("div");
		btn_container_node.id = "nav_btn"; 
		let btn_prev_node = document.createElement("a");    
		let btn_next_node = document.createElement("a");    
		btn_prev_node.appendChild(document.createTextNode("Προηγούμενο"));  
		btn_next_node.appendChild(document.createTextNode("Επόμενο"));  
		btn_prev_node.id = "prev_question";
		btn_next_node.id = "next_question";
		btn_prev_node.className='btn btn-warning';
		btn_next_node.className='btn btn-success';
		btn_container_node.appendChild(btn_prev_node);
		btn_container_node.appendChild(btn_next_node);
		this.insertAfter(btn_container_node, document.getElementById('groups_master'));

		btn_next_node.addEventListener("click", function(){ _this.nextStigma(); });
		btn_prev_node.addEventListener("click", function(){ _this.prevStigma(); });
		//document.getElementById("next_question").onclick = nextStigma;
		//document.getElementById("prev_question").onclick = prevStigma;
	}

	this.toggleBtns = function(current_stigma){
		if(current_stigma >= 1)
			document.getElementById('prev_question').classList.remove("hide_btn");
		else
			document.getElementById('prev_question').className += " hide_btn";

		if(current_stigma+1 == document.querySelectorAll('[data-group]').length)
			document.getElementById('next_question').className += " hide_btn";
		else
			document.getElementById('next_question').classList.remove("hide_btn");
	}

	this.add_btn();

	this.init_setup();

	window.addEventListener('resize', function(event) {
		_this.removeAllAttr();

		current_stigma = 0;

		if(break_size.matches) {
			paired_items = options.min_items;
		}else{
			paired_items = options.max_items;
		}

		cw = document.getElementById('groups_master').offsetWidth;
		giw = options.item_width * paired_items;
		init_pos = (cw+(cw/2)) - (giw/2);
		_this.init_setup();

	}, true);

}

/*var rv = new RapidViewer({
	item_width: 300,
	max_items: 3,
	min_items: 1,
	break: 900
});*/