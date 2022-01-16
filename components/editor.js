import { useEffect, useRef, useState } from 'react';
import { useCodeMirror } from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { cpp } from '@codemirror/lang-cpp';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { json } from '@codemirror/lang-json';
import { markdown } from '@codemirror/lang-markdown';
import { rust } from '@codemirror/lang-rust';
import { xml } from '@codemirror/lang-xml';
import { java } from '@codemirror/lang-java';
import { wast } from '@codemirror/lang-wast';
import { php } from '@codemirror/lang-php';
import { lezer } from '@codemirror/lang-lezer';
import { python } from '@codemirror/lang-python';

import { yCollab, yUndoManagerKeymap } from 'y-codemirror.next'
import { basicSetup } from '@codemirror/basic-setup'
import { keymap } from '@codemirror/view'

import store from "../realtime/store";
import { getWebSocketProvider } from '../realtime/store';

const Editor = ({ id }) => {
    const editor = useRef();
    const [editorLanguege, setEditorLanguege] = useState(javascript());
    const webSocketProvider = getWebSocketProvider(id);
    let ytext = store.bitecrowdText

    const { setContainer } = useCodeMirror({
        value: ytext.toString(),
        container: editor.current,
        extensions: [
            keymap.of([
                ...yUndoManagerKeymap
            ]),
            basicSetup,
            editorLanguege,
            yCollab(ytext, webSocketProvider.awareness)
        ]
    });

    useEffect(() => {
        window.javascript = javascript;
        window.cpp = cpp;
        window.html = html;
        window.css = css;
        window.json = json;
        window.markdown = markdown;
        window.rust = rust;
        window.xml = xml;
        window.java = java;
        window.wast = wast;
        window.php = php;
        window.lezer = lezer;
        window.python = python;
    }, [])

    useEffect(() => {
        if (editor.current) {
            setContainer(editor.current);
        }
    }, [editor.current]);


    return (
        <>
            <div ref={editor} />
            <div style={{
                position: "fixed",
                bottom: 0,
                backgroundColor: "#9ecfff",
                width: "100%",
                height: "3%",
                marginBottom: 0,
                paddingBottom: 0,
            }}>
                <label htmlFor="languages">Language:</label>
                <select
                    name="languages"
                    onChange={e => { setEditorLanguege(Function('return ' + e.target.value.toString())) }
                    }
                >
                    <option value="javascript()">Javascript</option>
                    <option value="cpp()">C++</option>
                    <option value="html()">HTML</option>
                    <option value="css()">CSS</option>
                    <option value="json()">JSON</option>
                    <option value="markdown()">Markdown</option>
                    <option value="rust()">Rudt</option>
                    <option value="xml()">XML</option>
                    <option value="java()">Java</option>
                    <option value="wast()">Wast</option>
                    <option value="lezer()">Lezer</option>
                    <option value="python()">Python</option>
                </select>
            </div>
        </>)

};

export default Editor;