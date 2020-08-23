import React, { useState } from "react";
import Main from "../Componentes/Main";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import Loading from "../Componentes/Loading";
import Axios from "axios";

export default function Upload() {
  return (
    <Main center>
      <div className="Upload">
        <form>
          <div className="Upload__image-section"></div>
          <textarea
            name="caption"
            className="Upload__caption"
            required
            maxLength="180"
            placeholder="Caption de tu post."
          ></textarea>
          <button className="Upload__submit" type="submit">
            Post
          </button>
        </form>
      </div>
    </Main>
  );
}
