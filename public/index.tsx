import { _createElement, _fragment } from "simple-jsx-handler";
import { MailTo } from "./components/MailTo";

document.addEventListener("DOMContentLoaded", () => {
  const loadingTextElement = <p class="text-center"></p>;

  const loadingText: string[] = [
    "Loading the website...",
    "I'm still loading...",
    "Reticulating splines...",
    "Generating witty loading message...",
    "Loading the loading message...",
    "Still loading...",
    "Making things load...",
    "It's possible that I'm loading...",
    "Not sure if I'm loading...",
    "Am I loading?",
    "Loading...",
    "Connecting...",
    "Processing request...",
    "Establishing connection...",
    "Receiving data...",
    "Decoding response...",
    "Analyzing content...",
    "Rendering page...",
    "Error detected...",
    "Looping process...",
    "Starting over...",
    "Loading... forever.",
    "Loading in the background...",
    "Double-checking the load...",
    "Still contemplating the load...",
    "Is it loaded yet?...",
    "Almost done loading... maybe...",
    "Taking a deep breath before loading...",
    "Initiating another load attempt...",
    "Loading with extra patience...",
    "Reassessing the load status...",
    "Just a little more loading...",
    "Reconfirming the load...",
    "Pretending to load...",
    "Loading optimism...",
    "Running out of things to load...",
    "Reloading the load...",
    "Hoping this time it loads...",
    "Infinite loading engaged...",
    "Loading existential dread...",
    "Still loading... eternally.",
    "Loading some more hope...",
    "Waiting for the load to finish loading...",
    "Second-guessing the load...",
    "Loading a progress bar... slowly...",
    "Reconfiguring load parameters...",
    "Attempting to load the last load...",
    "Spinning in circles... loading...",
    "Reaching deeper into the loading abyss...",
    "Maybe this is the final load...",
    "Calculating how much is left to load...",
    "Loading the next phase of loading...",
    "Contemplating life choices while loading...",
    "Wishing for a quicker load...",
    "Is this the load that never ends?...",
    "Still deeply engaged in loading...",
    "Loading the infinite loop...",
    "Rethinking what loading even means...",
    "Pondering the philosophy of loading...",
    "Forever caught in the loading cycle...",
  ];

  let currentLoadingText = -1;

  function updateLoading() {
    if (currentLoadingText === loadingText.length - 1) {
      currentLoadingText = 0;
    }

    loadingTextElement.textContent = loadingText[++currentLoadingText];
  }

  setInterval(updateLoading, 5000);
  updateLoading();

  document.body.appendChild(
    <div class="container">
      <div class="columns">
        <div class="col-6 col-md-8 col-sm-12 col-mx-auto bg-gray round-edges p-2">
          <h1 class="m-2">cernavskis.dev</h1>
          <div class="p-2 col-8 col-mx-auto">
            <div class="divider m-6"></div>

            {loadingTextElement}
            <div class="loading loading-lg"></div>

            <div class="divider m-6"></div>
          </div>
          See what I'm doing on: <a href="https://github.com/SwanX1">GitHub</a>
          <p>
            Contact me at: <i class="icon icon-mail mr-1"></i>
            <mark>
              <MailTo name="karliscern" domain="gmail.com" />
            </mark>
          </p>
        </div>
      </div>
    </div>
  );
});
