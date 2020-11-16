## HOW TO USE

- Put index.android.bundle.map into "mobile/stacktrace" folder
    - index.android.bundle.map is specific to the version of the app that will
      report the errors
- Copy error stack that user gave as part of error report to "mobile/stacktrace/stacktrace.txt"
- Run NPM script "metro-symbolicate"
- You will get exact file names and line numbers where errors happened