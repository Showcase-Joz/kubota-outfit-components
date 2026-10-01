import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import styled from "@emotion/styled";
import { Container } from "./components/Container";
import GlobalStyles from "./style/GlobalStyles";
import { Minireset } from "./components/minireset";
import definitions from "../public/inputs.json";
import { readSaved } from "./utils/preview";
import {
  COMPONENT_STORAGE_KEY,
  DEFAULT_COMPONENT,
  previewComponents,
  resolveComponent,
  isPreviewInputVisible,
} from "./utils/workspace";

const PreviewShell = styled.div`
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  min-height: 100vh;
  --font-family-inter-default: Inter, Arial, sans-serif;
  --font-family-arial-black-default: "Arial Black", Arial, sans-serif;
  --color-black: #000;
  --color-white: #fff;
  --color-orange: #dc4405;
  aside {
    background: #22252b;
    color: #e8e9ed;
    border-right: 1px solid #3d414a;
    padding: 22px 18px;
    font: 13px/1.5 Arial, sans-serif;
    h2 {
      font-size: 16px;
      font-weight: 700;
      margin-bottom: 4px;
    }
    p {
      color: #b9bec8;
      margin-bottom: 20px;
    }
    label {
      display: block;
      margin: 14px 0;
    }
    input,
    select,
    textarea,
    button {
      display: block;
      width: 100%;
      margin-top: 5px;
      border: 1px solid #686d77;
      border-radius: 4px;
      padding: 7px 8px;
      font: inherit;
      color: #f5f6f8;
      background: #16181d;
    }
    textarea {
      resize: vertical;
    }
    button {
      cursor: pointer;
      margin-bottom: 16px;
    }
    small {
      display: block;
      color: #b9bec8;
      margin-top: 4px;
    }
    input:focus-visible,
    select:focus-visible,
    textarea:focus-visible,
    button:focus-visible {
      outline: 2px solid #f7915d;
      outline-offset: 2px;
    }
  }
  @media (max-width: 760px) {
    grid-template-columns: 1fr;
    > main {
      grid-row: 1;
      min-height: 0;
    }
    > aside {
      grid-row: 2;
    }
  }
`;

const ComponentPreview = ({ component, onComponentChange }) => {
  const { label, model } = previewComponents[component];
  const {
    readPreviewState,
    getPreviewInputs,
    setPreviewInput,
    resetPreviewLayout,
  } = model;
  const [previewState, setPreviewState] = useState(readPreviewState);
  const inputs = getPreviewInputs(previewState);
  const [storageError, setStorageError] = useState(false);
  useEffect(() => {
    try {
      window.localStorage.setItem(
        model.storageKey,
        JSON.stringify(previewState)
      );
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }, [previewState, model]);

  const setValue = (tag, value) =>
    setPreviewState((previous) => setPreviewInput(previous, tag, value));
  return (
    <>
      <GlobalStyles />
      <Minireset />
      <PreviewShell>
        <aside aria-label="Preview inputs">
          <h2>{label}</h2>
          <label>
            Component
            <select
              value={component}
              onChange={(event) => onComponentChange(event.target.value)}
            >
              {Object.entries(previewComponents).map(([id, item]) => (
                <option key={id} value={id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <p>
            Each layout starts with its template defaults. Your edits are saved
            separately for each layout.
          </p>
          <button
            type="button"
            onClick={() => setPreviewState(resetPreviewLayout)}
          >
            Use layout defaults
          </button>
          {storageError && (
            <p role="status">
              Browser storage is unavailable. Changes will only last for this
              session.
            </p>
          )}
          {definitions
            .filter((input) =>
              isPreviewInputVisible(
                input.tag,
                component,
                inputs.aspect_selection.value
              )
            )
            .map((input) => {
              const { tag, definition, custom_title: title } = input;
              const choices = definition.choices;
              const value = inputs[tag]?.value ?? "";
              const change = (event) => setValue(tag, event.target.value);
              return (
                <label key={tag}>
                  {title}
                  {choices && !definition.optional_text ? (
                    <select value={value} onChange={change}>
                      {choices.map((choice) => (
                        <option key={choice.value} value={choice.value}>
                          {choice.label}
                        </option>
                      ))}
                    </select>
                  ) : ["savingAmountPostText", "warrantyText"].includes(tag) ? (
                    <textarea rows="3" value={value} onChange={change} />
                  ) : (
                    <>
                      <input
                        value={value}
                        onChange={change}
                        type={
                          input.type === "Variables::Number" ? "number" : "text"
                        }
                        min={definition.min}
                        max={definition.max}
                        list={choices ? `${tag}-choices` : undefined}
                      />
                      {choices && (
                        <datalist id={`${tag}-choices`}>
                          {choices.map((choice) => (
                            <option key={choice.value} value={choice.value}>
                              {choice.label}
                            </option>
                          ))}
                        </datalist>
                      )}
                    </>
                  )}
                  {tag === "aPR" && (
                    <small>
                      {component === "warranty"
                        ? "This rollout is styled for 0% financing available. Other finance values remain available for later development."
                        : "Use a percentage, “available”, or “notApplicable”."}
                    </small>
                  )}
                </label>
              );
            })}
          <small>
            This local preview uses system font fallbacks if Inter or Arial
            Black is unavailable. Check final typography in Outfit with its
            brand fonts.
          </small>
        </aside>
        <Container
          inputs={{ ...inputs, component_selection: { value: component } }}
        />
      </PreviewShell>
    </>
  );
};

const PreviewApp = () => {
  const [component, setComponent] = useState(() =>
    resolveComponent(readSaved(COMPONENT_STORAGE_KEY, DEFAULT_COMPONENT))
  );
  const changeComponent = (value) => {
    const next = resolveComponent(value);
    setComponent(next);
    try {
      window.localStorage.setItem(COMPONENT_STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* Inputs show their own storage warning. */
    }
  };
  return (
    <ComponentPreview
      key={component}
      component={component}
      onComponentChange={changeComponent}
    />
  );
};

ReactDOM.render(<PreviewApp />, document.getElementById("root"));
