import {FONT_COLOR, FONT_FAMILY, FONT_SIZE} from './constants';

export function createCircle(
  data: any,
  x: number,
  y: number,
  r: number,
  onClick?: (e: MouseEvent, data: any) => void,
  onMouseover?: (e: MouseEvent, data: any) => void,
  onMouseout?: (e: MouseEvent, data: any) => void,
): HTMLDivElement {
  const circle: HTMLDivElement = document.createElement('div');
  circle.setAttribute('style', `
    position: absolute;
    left: ${x - r}px;
    top: ${y - r}px;
    border-radius: 50%;
    width: ${r * 2}px;
    height: ${r * 2}px;
    padding: 0px;
    background-size: cover;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: visable;
    text-overflow: ellipsis;
    color: ${FONT_COLOR};
    font-size: ${FONT_SIZE}px;
    font-family: ${FONT_FAMILY};
  `);
  const events = {
    'click': onClick,
    'mouseover': onMouseover,
    'mouseout': onMouseout,
  };
  for (let e in events) {
    circle.addEventListener(e, (event) => {
      events[e] && events[e](event, data);
    });
  }
  return circle;
}

export function createText(
  x: number,
  y: number,
  width: number,
  height: number,
  txt: string,
  z?: number,
): HTMLDivElement {
  const text = document.createElement('div');
  const zIndex = z != null ? z : 1;
  text.setAttribute('style', `
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    left: ${x - width / 2}px;
    top: ${y - height / 2}px;
    color: ${FONT_COLOR};
    font-family: ${FONT_FAMILY};
    font-size: ${FONT_SIZE};
    width: ${width}px;
    height: ${height}px;
    zIndex: ${zIndex};
    opacity: 0;
    white-space: nowrap;
  `);
  text.innerHTML += txt;
  return text;
}
