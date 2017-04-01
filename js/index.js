class Pomodoro {
  /* Class for handling pomodoro clock */

  constructor() {
    this._session = 25;
    this._break = 5;
  }

  getSession() {
    return this._session;
  }

  getBreak() {
    return this._break;
  }

  increaseBreak() {
    this._break++;
  }

  decreaseBreak() {
    if (this._break > 0) {
      this._break--;
    }
  }

  increaseSession() {
    this._session++;
  }

  decreaseSession() {
    if (this._session > 0) {
      this._session--;
    }
  }

  simulation(minutes, seconds) {
    /* Simulation for session and break
       Returns the minutes and seconds left after 1 seconds,
       false if time's over.
     */

    if (seconds > 0) {
      seconds--;
    } else {
      minutes--;
      seconds = 59;
    }

    if (minutes < 0) {
      return false;
    }

    return [minutes, seconds];
  }

}

class Display {
  /* Displays the pomodoro time on the screen */

  constructor() {
    this._p = new Pomodoro();
    this._current = "session";
    this._interval = false;
    this._min = this._p.getSession();
    this._secs = 0;
  }

  current() {
    return this._current;
  }

  decBreak() {
    // Decreases the break time by 1 minute and returns new time
    this._p.decreaseBreak();
    return this._p.getBreak();
  }

  incBreak() {
    // Increases the break time by 1 minute and returns new time
    this._p.increaseBreak();
    return this._p.getBreak();
  }

  decSession() {
    // decrease the session time by 1 minute and returns new time.
    this._p.decreaseSession();
    return this._p.getSession();
  }

  incSession() {
    // increase the session time 1 minute and returns new time.
    this._p.increaseSession();
    return this._p.getSession();
  }

  start() {
    /* Runs the simulation for break and session. */
    var that = this;

    this._interval = setInterval(function() {
      // get new time
      var arr = that._p.simulation(that._min, that._secs);

      // switch to break or session.
      if (arr === false) {
        if (that._current === "session") {
          that._startBreak();
          return;
        } else {
          that._startSession();
          return;
        }
      }
      that._min = arr[0];
      that._secs = arr[1];
      // styling as appropriate
      var str = "";
      if (arr[0] < 10)
        str = "0" + arr[0];
      else
        str = arr[0];

      str += ":";

      if (arr[1] < 10)
        str += "0" + arr[1];
      else
        str += arr[1];

      // displaying time on screen
      $("#display").html(str);

    }, 1000);
  }

  stop() {
    /* Stops the simulation */
    clearInterval(this._interval);
  }

  reset() {
    /* Resets the values of break and session timers */
    if (this._current === "session") {
      this._min = this._p.getSession();
      this._secs = 0;
    } else {
      this._min = this._p.getBreak();
      this._secs = 0;
    }
  }

  _startSession() {
    /* Starts the Session Timer. */
    clearInterval(this._interval);
    this._current = "session";
    $("#currentRoutine").html("Session");
    this._min = this._p.getSession();
    this._secs = 0;
    this.start();
  }

  _startBreak() {
    /* Starts the Break Timer. */
    clearInterval(this._interval);
    this._current = "break";
    $("#currentRoutine").html("Break");
    this._min = this._p.getBreak();
    this._secs = 0;
    this.start();
  }
}

// display class that controls how user interacts with the Pomodoro class
var d = new Display();

// true when pomodoro not running, false when running
var indicator = true;

$(document).ready(function() {
  $("#control").on('click', function() {
    // run pomodoro
    if (indicator) {
      d.start();
      indicator = !indicator;
    }
    // stop pomodoro
    else {
      d.stop();
      indicator = !indicator;
    }
  });

  // decrease the break time
  $("#minusBreak").on('click', function() {
    if (indicator) {
      if (d.current() === "break") {
        var b = d.decBreak();
        $("#breakTime").html(b);
        $("#display").html(b);
        d.reset();
      } else {
        $("#breakTime").html(d.decBreak());
      }
    }
  });

  // increase the break time
  $("#plusBreak").on('click', function() {
    if (indicator) {
      if (d.current() == "break") {
        var b = d.incBreak();
        $("#breakTime").html(b)
        $("#display").html(b);
        d.reset();
      } else {
        $("#breakTime").html(d.incBreak());
      }
    }
  });

  // decrease the session time
  $("#minusSession").on('click', function() {
    if (indicator) {
      if (d.current() == "session") {
        var s = d.decSession();
        $("#sessionTime").html(s);
        $("#display").html(s);
        d.reset();
      } else {
        $("#sessionTime").html(d.decSession());
      }
    }
  });

  // increase the session time
  $("#plusSession").on('click', function() {
    if (indicator) {
      if (d.current() == "session") {
        var s = d.incSession();
        $("#sessionTime").html(s);
        $("#display").html(s);
        d.reset();

      } else {
        $("#sessionTime").html(d.incSession());
      }
    }
  });

});