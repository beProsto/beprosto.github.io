generate: ssg/target/release/ssg
	./ssg/target/release/ssg

ssg/target/release/ssg: ssg/src/*
	cd ssg ; cargo build -r