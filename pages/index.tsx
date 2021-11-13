import type { NextPage } from 'next'
import {  useState } from 'react'
import styles from '../styles/Home.module.css'

function componentToHex(c: number): string {
	var hex = c.toString(16);
	return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r: number, g: number, b: number): string {
	return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function hexToRgb(hex: string) {
	if(hex.length === 3) {
		hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
	}
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	var colors = [];
	if(!result) {
		colors = ["0", "0", "0"];
	} else {
		colors = result;
	}
	return {
	  r: parseInt(colors[1], 16),
	  g: parseInt(colors[2], 16),
	  b: parseInt(colors[3], 16)
	}
  }

function change(color: string): string {
	if(color.match('^(?:[0-9a-fA-F]{3}){1,2}$')) {
		return '#' + color;
	} else if(color.match('([0-9]+((,| )[0-9]+)+)')) {
		var colors: Array<number> = [];
		color.replaceAll(',', ' ').split(' ').forEach((e) => colors.push(parseInt(e)));
		if(colors[0] >= 0 && colors[0] <= 255 && colors[1] >= 0 && colors[1] <= 255 && colors[2] >= 0 && colors[2] <= 255) {
			return rgbToHex(colors[0], colors[1], colors[2]);
		}
	}
	return '';
}

const Home: NextPage = () => {
	var [mainStyle, setMainStyle] = useState({
		"background-color": "#000",
		"align-items": "center",
		"justify-content": "center",
		display: "flex",
		height: "100%",
		"flex-direction": "column"}
	);

	var [textColor, setTextColor] = useState({color: "#FFF", padding: 0, margin: "5px"});
	var [upText, setUpText] = useState('RGB');
	var [downText, setDownText] = useState('HEX');
	var [downValue, setDownValue] = useState('#000000');
	return (
		<>
			<div style={mainStyle}>
				<p style={textColor} className="upText">{upText}</p>
				<input className={styles.input} onChange={async e => {
					var copy = { ...mainStyle };
					const changed = change(e.target.value);
					if (changed !== '') {
						if (e.target.value.match('^(?:[0-9a-fA-F]{3}){1,2}$')) {
							let colors: Array<number> = [];
							setUpText("HEX");
							setDownText("RGB");
							if (changed.length == 7) {
								let aux = changed.replace('#', '').split('');
								for(let i = 0; i < 6; i += 2) {
									colors.push(parseInt(aux[i], 16) * 16 + parseInt(aux[i + 1], 16));
								}
							} else {
								changed.replace('#', '').split('').forEach((e) => {colors.push(parseInt(e, 16) * 16 + parseInt(e, 16));});
							}
							console.log(colors);
							if(colors[0] + colors[1] + colors[2] > 382) {
								setTextColor({color: "#000", padding: 0, margin: "5px"});
							} else {
								setTextColor({color: "#FFF", padding: 0, margin: "5px"});
							}
							let rgbValues = hexToRgb(e.target.value);
							setDownValue(`${rgbValues.r} ${rgbValues.g} ${rgbValues.b}`);
						} else {
							let colors: Array<number> = [];
							setUpText("RGB");
							setDownText("HEX");
							e.target.value.replaceAll(',', ' ').split(' ').forEach((e) => colors.push(parseInt(e)));
							if(colors[0] + colors[1] + colors[2] > 382) {
								setTextColor({color: "#000", padding: 0, margin: "5px"});
							} else {
								setTextColor({color: "#FFF", padding: 0, margin: "5px"});
							}
							setDownValue(rgbToHex(colors[0], colors[1], colors[2]));
							for(let i = 0; i < 3; i++) colors.pop();
						}
						copy['background-color'] = changed;
					}
					setMainStyle(copy);
					
				}}/>
				<p style={textColor}>{downText}</p>
				<p style={textColor}>{downValue}</p>
			</div>
			<style global jsx>{`
				html,
				body,
				body > div:first-child,
				div#__next {
				height: 100%;
				}
		`}</style>
		</>
	);
}

export default Home
