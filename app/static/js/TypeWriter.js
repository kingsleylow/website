/*
 * TypeWiter is an HTML type writing machine
 * it is designed to be light, self-sufficient and fast
 * it has no dependency
 * Copyright @ Paul de Renty (Edorenta) - 2018 
 */

"use strict";

const ascii = "!“#$%‘()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~\"";
var tw_n = 0;
var css_up = false;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

class TypeWriter {
    constructor(id, delay, bar) {
        if (css_up == false) { this.AddCSSClass(); css_up = true; }
        this.bar = bar;
        this.id = id;
        this.delay = delay; //ms per char
        this.el = document.getElementById(id);
        this.AddBar();
        tw_n++;
    }
    // Bar() {
    //     return ((Math.round((new Date()).getTime() / 400)) % 2 ? this.bar : " ");
    // }
    AddCSSClass() {
        CSS_Insert(".tw_blink",`
        {
            diplay: inline;
            animation: blinker 1s linear infinite;
        }`);
        CSS_AddKeyFrames("blinker",`
        {
            50% { opacity: 0; }
        }`);
    }
    async AddBar() {
        var tw_el = document.createElement('span');
        tw_el.setAttribute("id", "tw_" + tw_n);
        tw_el.classList.add("tw_blink");
        tw_el.innerHTML = this.bar;
        tw_el.appendAfter(this.el);
    }
    async Type(str) {//async?
        let n = str.length;
        let s = "";
        for (let i = 0; i < n; i++) {
            s += str[i];
            this.el.innerHTML = s; //+ this.Bar();
            await sleep(this.delay); //could also use setTimeout
        }
        this.el.innerHTML = str;
    }
    async DecodeType(str) {//async?
        let ascii_len = ascii.length;
        let x = 5; //random rounds
        let n = str.length;
        let s = "";
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < x; j++) {
                this.el.innerHTML = s + ascii[Math.floor(Math.random() * 94)];
                await sleep(this.delay / 6);
            }
            s += str[i];
            this.el.innerHTML = s;// + this.Bar();
            await sleep(this.delay / 6); //could also use setTimeout
        }
        this.el.innerHTML = str;
    }
    async Flush() {
        let str = this.el.innerHTML
        let n = str.length;
        let s = str;
        for (let i = 0; i < n + 1; i++) {
            s = str.substring(0, str.length - i);
            this.el.innerHTML = s;// + this.Bar();
            await sleep(this.delay / 4); //could also use setTimeout
        }
        this.el.innerHTML = "";
    }
    async DecodeFlush() {
        let ascii_len = ascii.length;
        let x = 5; //random rounds
        let str = this.el.innerHTML
        let n = str.length;
        let s = str;
        for (let i = 0; i < n + 1; i++) {
            for (let j = 0; j < x; j++) {
                this.el.innerHTML = s + ascii[Math.floor(Math.random() * 94)];// + this.Bar();
                await sleep(this.delay / 6);
            }
            s = str.substring(0, str.length - i);
            this.el.innerHTML = s;// + this.Bar();
            await sleep(this.delay / 3); //could also use setTimeout
        }
        this.el.innerHTML = "";
    }
    async MultiType(str_array, loop_enabled) {
        while (true) {
            let n = str_array.length;
            for (let i = 0; i < n; i++) {
                await this.Type(str_array[i]);
                if (loop_enabled || (i != n - 1)) {
                    await sleep(str_array[i].length * 50 + 500);
                    await this.Flush();
                }
                await sleep(500);
            }
            if (!loop_enabled) {
                break;
            }
        }
    }
}
