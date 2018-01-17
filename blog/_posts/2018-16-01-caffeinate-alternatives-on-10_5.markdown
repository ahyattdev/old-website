---
layout: post
title:  "An alternative to caffeinate on Mac OS X 10.5"
date:   2018-01-16 18:00:00 -0800
categories: general
---
Recent versions of macOS have shipped with a handy utility called `caffeinate` which can be used to prevent system sleep, display sleep and more. Unknown to me until I attempted to use the command on a PowerBook G4 running Mac OS X 10.5.8, `caffeinate` postdates Mac OS X Leopard.

For similar power management related activities on the command line, the utility `pmset` is often used. Sure enough, this utility is present on 10.5. After almost reaching the end of the manual page of `pmset` and about to look elsewhere, I saw our golden ticket:

`noidle - pmset prevents idle sleep by creating a PM assertion to prevent idle sleep(while running; hit ctrl-c to cancel).`

The same manual page from macOS 10.13.2 contains an additional bit of documentation relating to `noidle`:

`This argument is deprecated in favor of caffeinate(8). Please use caffeinate(8) instead.`

It seems fitting that it's now deprecated since `caffeinate` does the same thing and more as our little option.

Using our newly found option, we can conclude that the way to achieve the same results as running `caffeinate` on Leopard is with `pmset noidle`.
