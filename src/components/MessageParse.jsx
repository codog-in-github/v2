import { request } from "@/apis/requestBuilder";
import { basename } from "@/helpers";
import { useMemo } from "react";

const download = (url) => {
  request(url).download(basename(url)).send()
}
const FileNode = ({ src }) => {
  src = decodeURIComponent(src)
  return (
    <span className="px-2 py-1 bg-success-200 text-success-500 rounded-full cursor-pointer" onClick={() => download(src)}>{basename(src)}</span>
  )
}

const MessageParse = ({ message }) => {
  const ele = useMemo(() => {
    const parser =  new DOMParser();
    const docu = parser.parseFromString(message, 'text/html'); 
    const eles = []
    for(let i = 0; i < docu.body.childNodes.length; i++) {
      const node = docu.body.childNodes[i];
      if(node.nodeName === 'FILE') {
        eles.push(
          <FileNode key={`file-${i}`} src={node.getAttribute('src')} />
        )
      } else if (node.nodeName === '#text') {
        eles.push(node.textContent)
      }
    }
    return eles;
  }, [message])
  return ele;
};


export default MessageParse;
