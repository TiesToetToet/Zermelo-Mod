// document.addEventListener("DOMContentLoaded", function () {
//   // Get the stored color
//   console.log("DOM fully loaded and parsed");
//   addSettings();
// });

// Step 1: Define the key you want to check
keys = [
  {
    key: "start",
    label: "Start",
  },
  {
    key: "mijnRooster",
    label: "Mijn rooster",
  },
  {
    key: "mijnVakken",
    label: "Mijn vakken",
  },
  {
    key: "mijnKeuzepakket",
    label: "Mijn keuzepakket",
  },
  {
    key: "mijnGroepen",
    label: "Mijn groepen",
  },
  {
    key: "mijnCollegas",
    label: "Mijn collega's",
  },
  {
    key: "mijnDocenten",
    label: "Mijn docenten",
  },
  {
    key: "alleRoosters",
    label: "Alle roosters",
  },
  {
    key: "mededelingen",
    label: "Mededelingen",
  },
  {
    key: "ouderavonden",
    label: "Ouderavonden",
  },
  {
    key: "eindexamens",
    label: "Eindexamens",
  },
  {
    key: "portal",
    label: "Portal",
  },
  {
    key: "appVerversen",
    label: "App verversen",
  },
  {
    key: "uitloggen",
    label: "Uitloggen",
  },
  {
    key: "compileren",
    label: "Compileren",
  },
]
document.onreadystatechange = () => {
  if (document.readyState === "complete") {
    console.log("DOM fully loaded and parsed");
    let intervalId = setInterval(() => {
      document.querySelectorAll("path").forEach((path) => {
        if (path.getAttribute("stroke") === "rgb(132,142,153)") {
          path.setAttribute("stroke", "var(--mainColor)");
        }
      });
    }, 100); // 100 milliseconds = 0.1 second
    
    setTimeout(() => {
      clearInterval(intervalId); // Stop the interval after 2 seconds
    }, 2000); // 2000 milliseconds = 2 seconds
    body = document.querySelector("body");
    body.style.userSelect = "auto";
    addSettings();

  }
};
function changeLoader() {
  animationContainer = document.querySelector("#animationContainer");
  if (animationContainer) {
    animationContainer.querySelectorAll("path").forEach((path) => {
      if (path.getAttribute("stroke") === "rgb(132,142,153)") {
        path.setAttribute("stroke", "var(--mainColor)");
      }
    });
  }
}
document.addEventListener("click", function (event) {
  try {
let intervalId = setInterval(() => {
  document.querySelectorAll("path").forEach((path) => {
    if (path.getAttribute("stroke") === "rgb(132,142,153)") {
      path.setAttribute("stroke", "var(--mainColor)");
    }
  });
}, 100); // 100 milliseconds = 0.1 second

setTimeout(() => {
  clearInterval(intervalId); // Stop the interval after 2 seconds
}, 2000); // 2000 milliseconds = 2 seconds
      
  } catch (error) {
    console.log("No loader found");
  }
});
function addSettings() {
  let checkInterval = 100; // Check every 100 milliseconds
  let maxDuration = 5000; // Maximum duration to check for
  let elapsed = 0; // Time elapsed

  let checkExist = setInterval(function () {
    var menuPage = document.getElementsByClassName("menuPage")[0];
    if (menuPage) {
      console.log(menuPage);
      var menu = menuPage.querySelectorAll(".menuContent")[0];

      var items = menu.children;
      setExistingMenus();
      // Array.from(keys).forEach(function (item) {
      //   // Use item.key as a key in chrome.storage.local
      //   var key = item.key;
      //   console.log(key)
      //   
      // });
      Array.from(menu.children).forEach(function (child) {
        var labelText = child.querySelector(".label").textContent;
        // Find the corresponding key object in the keys array
        var keyObject = keys.find(k => k.label === labelText);
        if (keyObject) {
          var key = keyObject.key;
          console.log(key)
          chrome.storage.local.get([key], function(result) {
            console.log(result[key])
            if (result[key]) {
              // If the value is true, show the item and remove aria-hidden
              child.style.display = "";
              child.removeAttribute("aria-hidden");
            } else {
              // If the value is false or not set, hide the item and add aria-hidden="true"
              child.style.display = "none";
              child.setAttribute("aria-hidden", "true");
            }
          });
        }
      });

      clearInterval(checkExist); // Stop checking if menuPage is found
    } else if (elapsed >= maxDuration) {
      console.log("menuPage not found after 5 seconds.");
      clearInterval(checkExist); // Stop checking after 5 seconds
    }
    elapsed += checkInterval;
  }, checkInterval);

  setTimeout(function () {
    clearInterval(checkExist); // Ensure the interval is cleared after 5 seconds
  }, maxDuration);
}
// mijn groepen [4]
// portal [11]

function setExistingMenus() {
  menu = document.getElementsByClassName("menuContent")[0];
  function findMenuItemByLabel(label) {
    return Array.from(menu.children).find((item) => {
      const itemLabel = item.querySelector(".label");
      return itemLabel.textContent === label;
    });
  }

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i].key;
    chrome.storage.local.get([key], function (result) {
      if (result[key] === undefined) {
        item = findMenuItemByLabel(keys[i].label)
        var active = true
        if (item.style.display === "none") {
          active = false
        } else {
          active = true
        }
        chrome.storage.local.set({ [key]: active });
      }
    });
  }
}


chrome.storage.local.get(["enabled"]).then((result) => {
  modEnabled = result.enabled;
  load(modEnabled);
});

function load(modEnabled) {
  if (modEnabled) {
    function settings() {
      addMenu();
      setData();
      
      
      function addMenu() {
        chrome.storage.local.get(
          {
            options: {
              // Provide default values if not already stored
              colorMain: "#2c3e50",
              colorGeneral: "#7b7bb3",
              colorExam: "#e8cb22",
              colorActivity: "#268e26",
            },
          },
          function (data) {
            const options = data.options;
            hoverColor = adjust(colorMain, 50);
            colorMain = options.colorMain;
            console.log(colorMain);
            if (getRelativeLuminance(hexToRgb(colorMain)) >= 240) {
              iconColour = adjust(colorMain, -170);
            } else if (getRelativeLuminance(hexToRgb(colorMain)) >= 160) {
              iconColour = adjust(colorMain, -110);
            } else {
              iconColour = "#5b5b5b";
            }
            console.log(iconColour);
            changeImage(iconColour, hoverColor);
            // Mapping storage keys to element IDs and their corresponding labels
            const idMapping = {
              colorMain: {
                picker: "colorPickerMain",
                hex: "hexColorInputMain",
                label: "colorPickerDivMain",
              },
              colorGeneral: {
                picker: "colorPickerGeneral",
                hex: "hexColorInputGeneral",
                label: "colorPickerDivGeneral",
              },
              colorExam: {
                picker: "colorPickerExam",
                hex: "hexColorInputExam",
                label: "colorPickerDivExam",
              },
              colorActivity: {
                picker: "colorPickerActivity",
                hex: "hexColorInputActivity",
                label: "colorPickerDivActivity",
              },
            };
  
            for (const key in options) {
              if (idMapping[key]) {
                const { picker, hex, label } = idMapping[key];
                const pickerElement = document.getElementById(picker);
                const hexElement = document.getElementById(hex);
                const labelElement = document.querySelector(
                  `.${label} .colorCircle`
                );
                if (pickerElement && pickerElement.type === "color") {
                  pickerElement.value = options[key];
                }
                if (hexElement) {
                  hexElement.value = options[key];
                }
                if (labelElement) {
                  labelElement.style.backgroundColor = options[key];
                }
              }
            }
          }
        );
        
        keys.forEach(function(item) {
          chrome.storage.local.get([item.key], function(result) {
            // Assuming the result for each key is either true or false
            var checkbox = document.getElementById(item.key).querySelector('input[type="checkbox"]');
            console.log(result[item.key])
            if (checkbox) {
              checkbox.checked = !!result[item.key]; // Convert the result to boolean and set the checkbox
            }
          });
        });

        var settingsPage = document.getElementsByClassName("settingsPage")[0];
        if (settingsPage != null) {
          // Check if an element with the class 'menuContent' already exists within 'settingsPage'
          var menuContents = settingsPage.querySelectorAll(".menuContent");

          if (menuContents.length < 2) {
            // If no existing 'menuContent' is found, proceed to create and append the new 'div'
            var div = document.createElement("div");
            div.innerHTML = `
                  <h3 style="margin-left: 16px;">Zermelo Mod Instellingen</h3>
                  <br>
                  <h4 style="margin-left: 16px;">Kleuren</h4>
                  <h5 style="margin-left: 16px;">Kies de kleuren die jij binnen zermelo wilt hebben</h5>
                  <div class="colors">
                      <div class="colors-list">
                          <div class="colorPickerDivMain">
                              <h4>Algemene kleur van zermelo</h4>
                              <label for="colorPickerMain" class="colorCircle"></label>
                              <input type="text" id="hexColorInputMain" name="hexColor" pattern="#?[0-9A-Fa-f]{6}" title="Hex color code (e.g., #123ABC or 123ABC)">
                              <input type="color" oninput="this.parentElement.children[1].style.backgroundColor = this.value; this.parentElement.children[2].value = this.value" id="colorPickerMain" name="color" class="hiddenColorPicker">
                          </div>
                          <div class="colorPickerDivGeneral">
                              <h4>Kleur van de lessen</h4>
                              <label for="colorPickerGeneral" class="colorCircle"></label>
                              <input type="text" id="hexColorInputGeneral" name="hexColor" pattern="#?[0-9A-Fa-f]{6}" title="Hex color code (e.g., #123ABC or 123ABC)">
                              <input type="color" oninput="this.parentElement.children[1].style.backgroundColor = this.value; this.parentElement.children[2].value = this.value" id="colorPickerGeneral" name="color" class="hiddenColorPicker">
                          </div>
                          <div class="colorPickerDivExam">
                              <h4>Kleur van de toetsen</h4>
                              <label for="colorPickerExam" class="colorCircle"></label>
                              <input type="text" id="hexColorInputExam" name="hexColor" pattern="#?[0-9A-Fa-f]{6}" title="Hex color code (e.g., #123ABC or 123ABC)">
                              <input type="color" oninput="this.parentElement.children[1].style.backgroundColor = this.value; this.parentElement.children[2].value = this.value" id="colorPickerExam" name="color" class="hiddenColorPicker">
                          </div>
                          <div class="colorPickerDivActivity">
                              <h4>Kleur van de activiteiten</h4>
                              <label for="colorPickerActivity" class="colorCircle"></label>
                              <input type="text" id="hexColorInputActivity" name="hexColor" pattern="#?[0-9A-Fa-f]{6}" title="Hex color code (e.g., #123ABC or 123ABC)">
                              <input type="color" oninput="this.parentElement.children[1].style.backgroundColor = this.value; this.parentElement.children[2].value = this.value" id="colorPickerActivity" name="color" class="hiddenColorPicker">
                          </div>
                      </div>
                  </div>
                  <br>
                  <h4 style="margin-left: 16px;">Menu</h4>
                  <h5 style="margin-left: 16px;">Kies welke menu items jij wilt zien</h5>
                  <div class="selectors">
                      <div class="menuButton">
                          <label class="switch" id="start">
                              <input type="checkbox" checked>
                              <span class="slider round"></span>
                          </label>
                          <label for="start">Start</label>
                      </div>
                      <div class="menuButton">
                          <label class="switch" id="mijnRooster">
                              <input type="checkbox" checked>
                              <span class="slider round"></span>
                          </label>
                          <label for="mijnRooster">Mijn rooster</label>
                      </div>
                      <div class="menuButton">
                          <label class="switch" id="mijnVakken">
                              <input type="checkbox" checked>
                              <span class="slider round"></span>
                          </label>
                          <label for="mijnVakken">Mijn vakken</label>
                      </div>
                      <div class="menuButton">
                          <label class="switch" id="mijnKeuzepakket">
                              <input type="checkbox" checked>
                              <span class="slider round"></span>
                          </label>
                          <label for="mijnKeuzepakket">Mijn keuzepakket</label>
                      </div>
                      <div class="menuButton">
                          <label class="switch" id="mijnGroepen">
                              <input type="checkbox" checked>
                              <span class="slider round"></span>
                          </label>
                          <label for="mijnGroepen">Mijn groepen</label>
                      </div>
                      <div class="menuButton">
                          <label class="switch" id="mijnCollegas">
                              <input type="checkbox" checked>
                              <span class="slider round"></span>
                          </label>
                          <label for="mijnCollegas">Mijn collega's</label>
                      </div>
                      <div class="menuButton">
                          <label class="switch" id="mijnDocenten">
                              <input type="checkbox" checked>
                              <span class="slider round"></span>
                          </label>
                          <label for="mijnDocenten">Mijn docenten</label>
                      </div>
                      <div class="menuButton">
                          <label class="switch" id="alleRoosters">
                              <input type="checkbox" checked>
                              <span class="slider round"></span>
                          </label>
                          <label for="alleRoosters">Alle roosters</label>
                      </div>
                      <div class="menuButton">
                          <label class="switch" id="mededelingen">
                              <input type="checkbox" checked>
                              <span class="slider round"></span>
                          </label>
                          <label for="mededelingen">Mededelingen</label>
                      </div>
                      <div class="menuButton">
                          <label class="switch" id="ouderavonden">
                              <input type="checkbox" checked>
                              <span class="slider round"></span>
                          </label>
                          <label for="ouderavonden">Ouderavonden</label>
                      </div>
                      <div class="menuButton">
                          <label class="switch" id="eindexamens">
                              <input type="checkbox" checked>
                              <span class="slider round"></span>
                          </label>
                          <label for="eindexamens">Eindexamens</label>
                      </div>
                      <div class="menuButton">
                          <label class="switch" id="portal">
                              <input type="checkbox" checked>
                              <span class="slider round"></span>
                          </label>
                          <label for="portal">Portal</label>
                      </div>
                      <div class="menuButton">
                          <label class="switch" id="appVerversen">
                              <input type="checkbox" checked>
                              <span class="slider round"></span>
                          </label>
                          <label for="appVerversen">App verversen</label>
                      </div>
                      <div class="menuButton">
                          <label class="switch" id="uitloggen">
                              <input type="checkbox" checked>
                              <span class="slider round"></span>
                          </label>
                          <label for="uitloggen">Uitloggen</label>
                      </div>
                      <div class="menuButton">
                          <label class="switch" id="compileren">
                              <input type="checkbox" checked>
                              <span class="slider round"></span>
                          </label>
                          <label for="compileren">Compileren</label>
                      </div>
                  </div>
                  <div class="item" id="saveButton"><div class="icon"> <i class="material-icons">save</i> </div> <div class="label">Instellingen Opslaan</div></div>
                  <div class="item" id="resetButton"><div class="icon"> <i class="material-icons">restart_alt</i> </div> <div class="label">Reset Instellingen</div></div>
                  <div class="bottomMargin"></div>
                  `;
            div.className = "menuContent";
            settingsPage.appendChild(div);
          } else {
            console.log("Menu content already exists.");
          }
        }
      }
    

      document
        .querySelector("#saveButton")
        .addEventListener("click", function (e) {
          chrome.storage.local.set({
            options: {
              colorMain: document.getElementById("colorPickerMain").value,
              colorGeneral: document.getElementById("colorPickerGeneral").value,
              colorExam: document.getElementById("colorPickerExam").value,
              colorActivity: document.getElementById("colorPickerActivity")
                .value,
            },
          });
          const settingsIds = [
            "start", "mijnRooster", "mijnVakken", "mijnKeuzepakket", "mijnGroepen", "mijnCollegas", "mijnDocenten", "alleRoosters", "mededelingen", "ouderavonden", "eindexamens", "portal", "appVerversen", "uitloggen", "compileren"
          ];
          
                // Function to update Chrome storage with the current state of all checkboxes
          function updateChromeStorage() {
            const settings = {};
            settingsIds.forEach(id => {
              const element = document.getElementById(id);
              if (element) {
                settings[id] = element.querySelector("input").checked;
              } else {
                console.error(`Element with ID ${id} not found.`);
              }
            });
          
            // Using callbacks
            for (const key in settings) {
              chrome.storage.local.set({ [key]: settings[key] }, function() {
                console.log(`Saved ${key} as ${settings[key]}`);
              });
            }
          }

          updateChromeStorage();
          
          location.reload();
        });

      // List of all settings corresponding to checkboxes
        

      document
        .querySelector("#resetButton")
        .addEventListener("click", function (e) {
          chrome.storage.local.set({
            options: {
              colorMain: "#2c3e50",
              colorGeneral: "#7b7bb3",
              colorExam: "#e8cb22",
              colorActivity: "#268e26",
            },
          });
          chrome.storage.local.set({
            start: undefined,
            mijnRooster: undefined,
            mijnVakken: undefined,
            mijnKeuzepakket: undefined,
            mijnGroepen: undefined,
            mijnCollegas: undefined,
            mijnDocenten: undefined,
            alleRoosters: undefined,
            mededelingen: undefined,
            ouderavonden: undefined,
            eindexamens: undefined,
            portal: undefined,
            appVerversen: undefined,
            uitloggen: undefined,
            compileren: undefined,
          })
          location.reload();
        });

      

      // After the existing code that sets up the color pickers and labels
      function setData() {

    
        document
          .getElementById("hexColorInputMain")
          .addEventListener("input", function () {
            console.log(this.value);
            document.getElementById("colorPickerMain").value = this.value;
            document.querySelector(
              ".colorPickerDivMain .colorCircle"
            ).style.backgroundColor = this.value;
          });

        document
          .getElementById("hexColorInputGeneral")
          .addEventListener("input", function () {
            document.getElementById("colorPickerGeneral").value = this.value;
            document.querySelector(
              ".colorPickerDivGeneral .colorCircle"
            ).style.backgroundColor = this.value;
          });

        document
          .getElementById("hexColorInputExam")
          .addEventListener("input", function () {
            document.getElementById("colorPickerExam").value = this.value;
            document.querySelector(
              ".colorPickerDivExam .colorCircle"
            ).style.backgroundColor = this.value;
          });

        document
          .getElementById("hexColorInputActivity")
          .addEventListener("input", function () {
            document.getElementById("colorPickerActivity").value = this.value;
            document.querySelector(
              ".colorPickerDivActivity .colorCircle"
            ).style.backgroundColor = this.value;
          });
      }
    }

    document.addEventListener("click", function (event) {
      // Check if the clicked element or any of its parents have the class 'item'
      let targetElement = event.target;
      do {
        if (targetElement.classList.contains("item")) {
          // Check if the item contains a div with class 'label' and text 'Instellingen'
          const label = targetElement.querySelector(".label");
          if (label && label.textContent.trim() === "Instellingen") {
            settings();
            // Add your action here
            return; // Stop the loop and exit the function
          } else if (label && label.textContent.trim() === "Portal") {
            window.location.pathname = "/main/";
          }
        }
        // Move up the DOM tree
        targetElement = targetElement.parentNode;
      } while (targetElement && targetElement !== document.body);
    });

    var colorMain;
    var colorGeneral;
    var colorExam;
    var colorActivity;

    chrome.storage.local.get(
      {
        options: {
          // Provide default values if not already stored
          colorMain: "#2c3e50",
          colorGeneral: "#7b7bb3",
          colorExam: "#e8cb22",
          colorActivity: "#268e26",
        },
      },
      function (data) {
        const options = data.options;
        // Log the values
        console.log("colorMain:", options.colorMain);
        console.log("colorGeneral:", options.colorGeneral);
        console.log("colorExam:", options.colorExam);
        console.log("colorActivity:", options.colorActivity);
        colorMain = options.colorMain;
        colorGeneral = options.colorGeneral;
        colorExam = options.colorExam;
        colorActivity = options.colorActivity;
        changeMainColors(colorMain);
        changeGeneralColors(colorGeneral);
        changeExamColors(colorExam);
        changeActivityColors(colorActivity);
        changeLogo(colorMain);
      }
    );

    function changeMainColors(mainColor) {
      console.log(colorMain);
      document.documentElement.style.setProperty("--mainColor", colorMain);
      // Existing conditions to adjust icon color based on luminance
      if (getRelativeLuminance(hexToRgb(colorMain)) >= 240) {
        iconColour = adjust(colorMain, -170);
      } else if (getRelativeLuminance(hexToRgb(colorMain)) >= 160) {
        iconColour = adjust(colorMain, -110);
      } else {
        iconColour = "#5b5b5b";
      }
      console.log(iconColour);

      // Additional check to see if the color is too light
      // If it is, make it a bit darker
      const luminance = getRelativeLuminance(hexToRgb(colorMain));
      if (luminance > 200) {
        // Assuming 'adjust' function makes the color darker with a negative value
        // Adjust the value as needed to make the color "a bit darker"
        colorMain = adjust(colorMain, -50); // Adjust by -50 as an example
      }

      // Continue with setting the main text color
      mainTextColor = toBrightnessValue(colorMain, 200);

      hoverColor = adjust(colorMain, 50);

      document.documentElement.style.setProperty("--iconColor", iconColour);
      document.documentElement.style.setProperty("--darkMainColor", iconColour);
      document.documentElement.style.setProperty(
        "--mainTextColor",
        mainTextColor
      );
      document.documentElement.style.setProperty(
        "--mainHoverColor",
        hoverColor
      );
      // Step 1: Retrieve the <img> element
    }

    function changeGeneralColors(generalColor) {
      document.documentElement.style.setProperty(
        "--generalColor",
        colorGeneral
      );
      generalLightColor = toBrightnessValue(colorGeneral, 300);
      document.documentElement.style.setProperty(
        "--generalColorLight",
        generalLightColor
      );
      // veryLightColor = toBrightnessValue(colorGeneral, 300);
      // document.documentElement.style.setProperty(
      //   "--veryLightGeneralColor",
      //   veryLightColor
      // );
    }

    function changeExamColors(examColor) {
      document.documentElement.style.setProperty("--examColor", colorExam);
      // veryLightExamColor = toBrightnessValue(colorExam, 300);
      // document.documentElement.style.setProperty(
      //   "--veryLightExamColor",
      //   veryLightExamColor
      // );
    }

    function changeActivityColors(activityColor) {
      document.documentElement.style.setProperty(
        "--activityColor",
        colorActivity
      );
      activityLightColor = toBrightnessValue(colorActivity, 300);
      document.documentElement.style.setProperty(
        "--activityLightColor",
        activityLightColor
      );
      // veryLightActivityColor = toBrightnessValue(colorActivity, 300);
      // document.documentElement.style.setProperty(
      //   "--veryLightActivityColor",
      //   veryLightActivityColor
      // );
    }

    const adjust = (col, amt) => {
      col = col.replace(/^#/, "");
      if (col.length === 3) {
        col = col[0] + col[0] + col[1] + col[1] + col[2] + col[2];
      }
      let [r, g, b] = col.match(/.{2}/g);
      [r, g, b] = [
        parseInt(r, 16) + amt,
        parseInt(g, 16) + amt,
        parseInt(b, 16) + amt,
      ];
      r = Math.max(Math.min(255, r), 0).toString(16);
      g = Math.max(Math.min(255, g), 0).toString(16);
      b = Math.max(Math.min(255, b), 0).toString(16);
      const rr = (r.length < 2 ? "0" : "") + r;
      const gg = (g.length < 2 ? "0" : "") + g;
      const bb = (b.length < 2 ? "0" : "") + b;
      return `#${rr}${gg}${bb}`;
    };

    // Convert hex to rgb
    const hexToRgb = (hex) =>
      hex
        .replace(
          /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
          (m, r, g, b) => "#" + r + r + g + g + b + b
        )
        .substring(1)
        .match(/.{2}/g)
        .map((x) => parseInt(x, 16));

    // Convert rgb to hex
    const rgbToHex = (r, g, b) =>
      "#" +
      [r, g, b]
        .map((x) => {
          const hex = x.toString(16);
          return hex.length === 1 ? "0" + hex : hex;
        })
        .join("");

    // Get brightness of color
    const getRelativeLuminance = (rgb) =>
      Math.round(0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]);

    // Change specific color channel
    function adjustColorChannel(channel, hex, value) {
      let rgb = hexToRgb(hex);
      rgb[channel] = Math.min(Math.max(rgb[channel] + value, 0), 255);
      return rgbToHex(rgb[0], rgb[1], rgb[2]);
    }

    // Change color brightness level
    function toBrightnessValue(color, target) {
      let i;
      let brightness;
      const startColor = color;
      for (i = 1; i <= 10; i++) {
        brightness = Math.round(getRelativeLuminance(hexToRgb(color)));
        color = adjust(color, target - brightness);
      }
      const rgbcolor = hexToRgb(startColor);
      const factor = Math.round(target * -0.15);
      // Color is mostly blue
      if (rgbcolor[2] > rgbcolor[0] && rgbcolor[2] > rgbcolor[1]) {
        color = adjustColorChannel(
          1,
          adjustColorChannel(0, color, factor),
          factor
        );
      }
      // Color is mostly red
      else if (rgbcolor[0] > rgbcolor[2] && rgbcolor[0] > rgbcolor[1]) {
        color = adjustColorChannel(
          2,
          adjustColorChannel(1, color, factor),
          factor
        );
      }
      // Color is mostly green
      else if (rgbcolor[1] > rgbcolor[0] && rgbcolor[1] > rgbcolor[2]) {
        color = adjustColorChannel(
          2,
          adjustColorChannel(0, color, factor),
          factor
        );
      }
      return color;
    }

    function changeImage(iconColor, colorHover) {
      const imgElementH = document.querySelector(
        `img[src="img/ic_koppel_extern_hover.svg"]`
      );

      if (imgElementH) {
        // Step 2: Create an <svg> element
        const svgElementH = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "svg"
        );

        // Step 3: Set necessary attributes (example: width and height)
        svgElementH.setAttribute("width", 24);
        svgElementH.setAttribute("height", 24);
        svgElementH.setAttribute("class", imgElementH.getAttribute("class")); // Copy class if needed

        // Step 4: Set the SVG content with the provided SVG
        svgElementH.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 24 24" style="--mainColor: #00aaff; --iconColor: #5b5b5b; --mainTextColor: #23cdff; --mainHoverColor: #32dcff; --generalColor: #7b7bb3; --generalColorLight: #d2d2ff; --examColor: #e8cb22; --activityColor: #268e26; --activityLightColor: #d2ffd2;" xml:space="preserve">
              <style type="text/css">
                .st0{fill:none;}
                .st2{fill:${colorHover};}
              </style>
              <g>
                <path class="st0" d="M0,0h24v24H0V0z"/>
                <path class="st2" d="M19,1H9C7.9,1,7,1.9,7,3v3h2V4h10v16H9v-2H7v3c0,1.1,0.9,2,2,2h10c1.1,0,2-0.9,2-2V3C21,1.9,20.1,1,19,1z"/>
                <g>
                  <path class="st2" d="M4,12c0-1.2,1-2.2,2.2-2.2H9V8.5H6.2c-1.9,0-3.5,1.6-3.5,3.5s1.6,3.5,3.5,3.5H9v-1.3H6.2C5,14.2,4,13.2,4,12z"/>
                  <rect x="6.9" y="11.3" class="st2" width="5.6" height="1.4"/>
                  <path class="st2" d="M13.2,8.5h-2.8v1.3h2.8c1.2,0,2.2,1,2.2,2.2s-1,2.2-2.2,2.2h-2.8v1.3h2.8c1.9,0,3.5-1.6,3.5-3.5    S15.1,8.5,13.2,8.5z"/>
                </g>
              </g>
            </svg>`; // Insert the provided SVG markup

        // Step 5: Replace the <img> element with the <svg> element
        parentElement = imgElementH.parentElement;
        console.log(parentElement);
        parentElement.replaceChild(svgElementH, imgElementH);
      }

      const imgElement = document.querySelector(
        `img[src="img/ic_koppel_extern_default.svg"]`
      );

      if (imgElement) {
        // Step 2: Create an <svg> element
        const svgElement = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "svg"
        );

        // Step 3: Set necessary attributes (example: width and height)
        svgElement.setAttribute("width", 24);
        svgElement.setAttribute("height", 24);
        svgElement.setAttribute("class", imgElement.getAttribute("class")); // Copy class if needed

        // Step 4: Set the SVG content with the provided SVG
        svgElement.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 24 24" style="--mainColor: #ffc1ed; --iconColor: #91537f; --mainTextColor: #f69ac6; --mainHoverColor: #ffc1ed; --generalColor: #ffc1ed; --generalColorLight: #ffd2d2; --examColor: #e8cb22; --activityColor: #268e26; --activityLightColor: #d2ffd2;" xml:space="preserve">
              <style type="text/css">
                  .st0{fill:none;}
                  .st1{fill:${iconColor};}
              </style>
              <g>
                  <path class="st0" d="M0,0h24v24H0V0z"/>
                  <path class="st1" d="M19,1H9C7.9,1,7,1.9,7,3v3h2V4h10v16H9v-2H7v3c0,1.1,0.9,2,2,2h10c1.1,0,2-0.9,2-2V3C21,1.9,20.1,1,19,1z"/>
                  <g>
                      <path class="st1" d="M4,12c0-1.2,1-2.2,2.2-2.2H9V8.5H6.2c-1.9,0-3.5,1.6-3.5,3.5s1.6,3.5,3.5,3.5H9v-1.3H6.2C5,14.2,4,13.2,4,12z    "/>
                      <rect x="6.9" y="11.3" class="st1" width="5.6" height="1.4"/>
                      <path class="st1" d="M13.2,8.5h-2.8v1.3h2.8c1.2,0,2.2,1,2.2,2.2s-1,2.2-2.2,2.2h-2.8v1.3h2.8c1.9,0,3.5-1.6,3.5-3.5    S15.1,8.5,13.2,8.5z"/>
                  </g>
              </g>
              </svg>`;

        parentElement = imgElement.parentElement;
        console.log(parentElement);
        parentElement.replaceChild(svgElement, imgElement);
      }
    }

    function changeLogo(color) {
      console.log("Changing logo color to:", color);
      bitDarkerColor = adjust(color, -50);
      var image = document.querySelector('img[alt="Zermelo Logo"]');
      if (image) {
        svgElement = `
                  <svg
                      class="logo"
                      xmlns:dc="http://purl.org/dc/elements/1.1/"
                      xmlns:cc="http://creativecommons.org/ns#"
                      xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
                      xmlns:svg="http://www.w3.org/2000/svg"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
                      xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" id="svg4303" version="1.1" inkscape:version="0.91 r13725" xml:space="preserve" width="408.08713" height="211.81012" viewBox="0 0 408.08713 211.81011" sodipodi:docname="zermelo2013.svg" style="--mainColor: #ffc1ed; --iconColor: #91537f; --mainTextColor: #f69ac6; --mainHoverColor: #ffc1ed; --generalColor: #ffc1ed; --generalColorLight: #ffd2d2; --examColor: #e8cb22; --activityColor: #268e26; --activityLightColor: #d2ffd2;">
                      <metadata id="metadata4309">
                          <rdf:RDF>
                              <cc:Work rdf:about="">
                                  <dc:format>image/svg+xml</dc:format>
                                  <dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage"/>
                                  <dc:title/>
                              </cc:Work>
                          </rdf:RDF>
                      </metadata>
                      <defs id="defs4307">
                          <clipPath clipPathUnits="userSpaceOnUse" id="clipPath4317">
                              <path d="m 0,841.89 595.275,0 L 595.275,0 0,0 0,841.89 Z" id="path4319" inkscape:connector-curvature="0"/>
                          </clipPath>
                      </defs>
                      <sodipodi:namedview pagecolor="#ffffff" bordercolor="#666666" borderopacity="1" objecttolerance="10" gridtolerance="10" guidetolerance="10" inkscape:pageopacity="0" inkscape:pageshadow="2" inkscape:window-width="1920" inkscape:window-height="1016" id="namedview4305" showgrid="false" fit-margin-top="0" fit-margin-left="0" fit-margin-right="0" fit-margin-bottom="0" inkscape:zoom="1.2685909" inkscape:cx="41.793346" inkscape:cy="152.35915" inkscape:window-x="0" inkscape:window-y="27" inkscape:window-maximized="1" inkscape:current-layer="g4311"/>
                      <g id="g4311" inkscape:groupmode="layer" inkscape:label="Logo Zermelo CMYK" transform="matrix(1.25,0,0,-1.25,-173.77137,631.91837)">
                          <g id="g4313">
                              <g id="g4315" clip-path="url(#clipPath4317)">
                                  <g id="g4321" transform="translate(139.0171,342.8555)">
                                      <path d="m 0,0 19.882,24.281 c 1.946,2.454 3.638,3.977 3.638,3.977 l 0,0.17 c 0,0 -1.27,-0.17 -3.977,-0.17 l -7.783,0 c -1.185,0 -1.862,-0.677 -1.862,-1.862 l 0,-2.453 -9.729,0 0,7.699 c 0,3.976 1.692,5.753 5.753,5.753 l 31.642,0 0,-5.837 L 17.682,7.275 C 15.736,4.907 14.044,3.301 14.044,3.301 l 0,-0.17 c 0,0 1.269,0.254 4.061,0.254 l 9.476,0 c 1.184,0 1.861,0.592 1.861,1.86 l 0,2.37 9.729,0 0,-7.615 c 0,-4.061 -1.692,-5.752 -5.669,-5.752 L 0,-5.752 0,0 Z" style="fill:${color};fill-opacity:1;fill-rule:nonzero;stroke:none" id="path4323" inkscape:connector-curvature="0"/>
                                  </g>
                                  <g id="g4325" transform="translate(212.5522,364.2598)">
                                      <path d="m 0,0 c -0.169,5.161 -3.723,8.715 -8.122,8.715 -5.5,0 -9.391,-3.3 -10.575,-8.715 L 0,0 Z m -8.122,17.006 c 12.351,0 19.12,-9.053 19.12,-20.474 0,-1.27 -0.254,-3.976 -0.254,-3.976 l -29.78,0 c 0.846,-7.615 6.43,-11.591 12.944,-11.591 6.938,0 12.098,4.822 12.098,4.822 l 4.484,-7.445 c 0,0 -6.599,-6.515 -17.343,-6.515 -14.298,0 -23.181,10.321 -23.181,22.589 0,13.283 8.968,22.59 21.912,22.59" style="fill:${color};fill-opacity:1;fill-rule:nonzero;stroke:none" id="path4327" inkscape:connector-curvature="0"/>
                                  </g>
                                  <g id="g4329" transform="translate(271.7026,369.252)">
                                      <path d="m 0,0 c 0,1.269 -0.676,1.861 -1.861,1.861 l -3.385,0 0,9.137 9.899,0 c 3.807,0 5.669,-1.776 5.669,-4.822 l 0,-1.269 c 0,-0.93 -0.085,-1.862 -0.085,-1.862 l 0.169,0 c 2.031,4.23 7.192,8.969 13.96,8.969 6.514,0 10.745,-3.046 12.605,-8.883 l 0.17,0 c 2.284,4.652 7.868,8.883 14.721,8.883 8.968,0 14.128,-5.076 14.128,-16.413 l 0,-16.836 c 0,-1.185 0.677,-1.861 1.862,-1.861 l 3.299,0 0,-9.052 -10.151,0 c -4.063,0 -5.755,1.691 -5.755,5.752 l 0,19.966 c 0,4.907 -0.93,8.629 -5.921,8.629 -5.33,0 -9.137,-4.483 -10.322,-9.897 -0.507,-1.693 -0.677,-3.47 -0.677,-5.5 l 0,-18.95 -10.745,0 0,25.718 c 0,4.653 -0.676,8.629 -5.837,8.629 -5.414,0 -9.053,-4.483 -10.406,-9.983 -0.423,-1.692 -0.677,-3.468 -0.677,-5.414 l 0,-18.95 -10.66,0 L 0,0 Z" style="fill:${color};fill-opacity:1;fill-rule:nonzero;stroke:none" id="path4331" inkscape:connector-curvature="0"/>
                                  </g>
                                  <g id="g4333" transform="translate(377.2793,364.2598)">
                                      <path d="m 0,0 c -0.17,5.161 -3.723,8.715 -8.123,8.715 -5.499,0 -9.391,-3.3 -10.575,-8.715 L 0,0 Z m -8.123,17.006 c 12.353,0 19.12,-9.053 19.12,-20.474 0,-1.27 -0.252,-3.976 -0.252,-3.976 l -29.781,0 c 0.846,-7.615 6.431,-11.591 12.945,-11.591 6.937,0 12.098,4.822 12.098,4.822 l 4.483,-7.445 c 0,0 -6.598,-6.515 -17.344,-6.515 -14.296,0 -23.18,10.321 -23.18,22.589 0,13.283 8.968,22.59 21.911,22.59" style="fill:${color};fill-opacity:1;fill-rule:nonzero;stroke:none" id="path4335" inkscape:connector-curvature="0"/>
                                  </g>
                                  <g id="g4337" transform="translate(397.832,386.1729)">
                                      <path d="m 0,0 c 0,1.269 -0.678,1.86 -1.862,1.86 l -3.384,0 0,9.138 10.237,0 c 3.976,0 5.752,-1.777 5.752,-5.754 l 0,-43.4 c 0,-1.185 0.678,-1.861 1.862,-1.861 l 3.3,0 0,-9.052 -10.152,0 C 1.692,-49.069 0,-47.378 0,-43.317 L 0,0 Z" style="fill:${color};fill-opacity:1;fill-rule:nonzero;stroke:none" id="path4339" inkscape:connector-curvature="0"/>
                                  </g>
                                  <g id="g4341" transform="translate(402.2432,393.2695)">
                                      <path d="m 0,0 c 1.958,0.007 2.661,-0.906 2.661,-2.161 l 0,-43.217 c 0,-3.292 1.693,-5.647 5.537,-5.647 l 3.296,0 0,3.912 -3.3,0 c -1.184,0 -1.862,0.675 -1.862,1.86 l 0,43.4 c 0,3.977 -1.776,5.754 -5.752,5.754 l -10.237,0 L -9.657,0 0,0 Z" style="fill:${bitDarkerColor};fill-opacity:1;fill-rule:nonzero;stroke:none" id="path4343" inkscape:connector-curvature="0"/>
                                  </g>
                                  <g id="g4345" transform="translate(441.7988,345.2246)">
                                      <path d="m 0,0 c 7.022,0 12.859,5.414 12.859,13.451 0,7.953 -5.837,13.453 -12.859,13.453 -6.938,0 -12.774,-5.5 -12.774,-13.453 C -12.774,5.414 -6.938,0 0,0 m 0,36.041 c 13.199,0 23.688,-9.391 23.688,-22.59 C 23.688,0.17 13.199,-9.138 0,-9.138 c -13.113,0 -23.604,9.308 -23.604,22.589 0,13.199 10.491,22.59 23.604,22.59" style="fill:${color};fill-opacity:1;fill-rule:nonzero;stroke:none" id="path4347" inkscape:connector-curvature="0"/>
                                  </g>
                                  <g id="g4349" transform="translate(233.9556,369.252)">
                                      <path d="m 0,0 c 0,1.269 -0.676,1.861 -1.861,1.861 l -3.384,0 0,9.137 9.814,0 c 3.807,0 5.753,-1.606 5.753,-5.245 l 0,-2.538 c 0,-1.608 -0.169,-2.708 -0.169,-2.708 l 0.169,0 c 1.946,6.177 7.107,11.083 13.706,11.083 0.93,0 1.946,-0.168 1.946,-0.168 l 0,-10.575 c 0,0 -1.1,0.168 -2.623,0.168 -4.569,0 -9.814,-2.622 -11.76,-9.053 -0.592,-2.114 -0.931,-4.483 -0.931,-7.021 l 0,-17.089 -10.66,0 L 0,0 Z" style="fill:${color};fill-opacity:1;fill-rule:nonzero;stroke:none" id="path4351" inkscape:connector-curvature="0"/>
                                  </g>
                                  <g id="g4353" transform="translate(237.5894,369.2471)">
                                      <path d="m 0,0 c 0,6.118 -5.502,5.787 -5.502,5.787 l -3.377,0 0,-3.921 3.384,0 c 1.185,0 1.861,-0.593 1.861,-1.861 l 0,-32.149 3.643,0.004 L 0,0 Z" style="fill:${bitDarkerColor};fill-opacity:1;fill-rule:nonzero;stroke:none" id="path4355" inkscape:connector-curvature="0"/>
                                  </g>
                                  <g id="g4357" transform="translate(323.792,490.7773)">
                                      <path d="M 0,0 C -8.962,9.065 -21.415,14.688 -35.175,14.688 -48.935,14.688 -61.381,9.065 -70.349,0 L 0,0 Z" style="fill:${color};fill-opacity:1;fill-rule:nonzero;stroke:none" id="path4359" inkscape:connector-curvature="0"/>
                                  </g>
                                  <g id="g4361" transform="translate(254.4683,420.313)">
                                      <path d="m 0,0 c 8.879,-8.477 20.903,-13.689 34.149,-13.689 13.25,0 25.269,5.212 34.152,13.689 L 0,0 Z" style="fill:${bitDarkerColor};fill-opacity:1;fill-rule:nonzero;stroke:none" id="path4363" inkscape:connector-curvature="0"/>
                                  </g>
                                  <g id="g4365" transform="translate(342.8311,505.5347)">
                                      <path d="m 0,0 -3.62,0 c 0,-31.814 -16.247,-52.841 -49.642,-64.266 l 1.366,-3.906 43.536,0 c 2.334,5.746 3.63,12.028 3.63,18.616 0,5.719 -0.982,11.208 -2.766,16.317 C -2.522,-23.698 0,-12.569 0,0" style="fill:${bitDarkerColor};fill-opacity:1;fill-rule:nonzero;stroke:none" id="path4367" inkscape:connector-curvature="0"/>
                                  </g>
                                  <g id="g4369" transform="translate(285.4287,465.9438)">
                                      <path d="m 0,0 c -13.627,-5.009 -24.166,-12.051 -31.352,-20.967 -8.173,-10.138 -12.317,-23.047 -12.317,-38.369 l 2.892,0 c 0,27.725 13.635,46.259 41.642,56.573 L 0,0 Z" style="fill:${bitDarkerColor};fill-opacity:1;fill-rule:nonzero;stroke:none" id="path4371" inkscape:connector-curvature="0"/>
                                  </g>
                                  <g id="g4373" transform="translate(283.0332,473.6016)">
                                      <path d="m 0,0 -40.655,0 c -2.09,-5.474 -3.245,-11.413 -3.245,-17.623 0,-5.484 0.909,-10.753 2.557,-15.68 -5.13,-9.643 -7.728,-20.924 -7.728,-33.691 l 3.618,0 c 0,30.843 15.278,51.553 46.641,63.196 L 0,0 Z" style="fill:${color};fill-opacity:1;fill-rule:nonzero;stroke:none" id="path4375" inkscape:connector-curvature="0"/>
                                  </g>
                                  <g id="g4377" transform="translate(332.1377,505.5347)">
                                      <path d="m 0,0 c 0,-28.769 -14.672,-47.646 -44.854,-57.704 l 0.952,-2.733 c 15.148,5.054 26.75,12.477 34.48,22.066 C -1.247,-28.229 2.896,-15.32 2.896,0 L 0,0 Z" style="fill:${color};fill-opacity:1;fill-rule:nonzero;stroke:none" id="path4379" inkscape:connector-curvature="0"/>
                                  </g>
                              </g>
                          </g>
                      </g>
                  </svg>
                  `;

        const parser = new DOMParser();
        const doc = parser.parseFromString(svgElement, "image/svg+xml");

        // Step 3: Extract the SVG element
        const svgNode = doc.documentElement;

        parentElement = image.parentElement;
        console.log(parentElement);
        parentElement.replaceChild(svgNode, image);
      }
    }

  } else {
    document.documentElement.style.setProperty("--mainColor", "#2c3e50");
    document.documentElement.style.setProperty("--generalColor", "#7b7bb3");
    document.documentElement.style.setProperty("--examColor", "#e8cb22");
    document.documentElement.style.setProperty("--activityColor", "#268e26");
    document.documentElement.style.setProperty("--iconColor", "#5b5b5b");
    document.documentElement.style.setProperty("--mainTextColor", "#2c3e50");
    document.documentElement.style.setProperty("--mainHoverColor", "#412e9b");
    document.documentElement.style.setProperty(
      "--generalColorLight",
      "#c5c9e2"
    );
    document.documentElement.style.setProperty(
      "--activityLightColor",
      "#74b474"
    );
    document.documentElement.style.setProperty("--darkMainColor", "#25323f");
  }
}
