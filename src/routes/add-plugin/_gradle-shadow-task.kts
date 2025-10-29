tasks.named<com.github.jengelman.gradle.plugins.shadow.tasks.ShadowJar>("shadowJar") {
    configurations = listOf(project.configurations.runtimeClasspath.get())
    dependencies { exclude { it.moduleGroup != "org.bstats" } }
    relocate("org.bstats", project.group.toString())
}