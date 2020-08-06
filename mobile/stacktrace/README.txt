## HOW TO USE

- Put index.android.bundle.map into "mobile/stacktrace" folder
    - index.android.bundle.map is specific to the version of the app that will
      report the errors
- Copy stack trace user gave to error report to "mobile/stacktrace/stacktrace.txt"
- Run NPM script "metro-symbolicate"
- You will get exact file names and line numbers where errors happened