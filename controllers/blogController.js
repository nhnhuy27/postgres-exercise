const controller = {}
const models = require("../models")

controller.showList = async (req, res) => {
	const allBlogs = await models.Blog.findAll({
		attributes: ["id", "title", "imagePath", "summary", "createdAt"],
		include: [
			{model: models.Comment},
			{model: models.Category},
			{model: models.Tag},
		],
	})
	const info = req.query.info
	let filteredBlogs = []
	if (info != null) {
		filteredBlogs = await allBlogs.filter((model) => {
			return model.title.toLowerCase().includes(info.toLowerCase())
		})
	} else filteredBlogs = allBlogs

	const categories = await models.Category.findAll({
		attributes: ["name"],
		include: [{model: models.Blog}],
	})

	const category = req.query.category
	if (category != null) {
		filteredBlogs = await filteredBlogs.filter((model) => {
			return model.Category.name == category
		})
	}

	const tags = await models.Tag.findAll({
		attributes: ["name"],
	})

	const tag = req.query.tag
	if (tag != null) {
		filteredBlogs = await filteredBlogs.filter((model) => {
			const tagList = model.Tags
			let nameList = []
			tagList.forEach((tagInTags) => {
				nameList.push(tagInTags.name)
			})
			return nameList.includes(tag)
		})
	}

	res.locals.blogs = filteredBlogs

	let page = parseInt(req.query.page) || 1
	let per_page = 6
	let start = (page - 1) * per_page
	let end = page * per_page
	let max_page = res.locals.blogs.length / per_page
	res.locals.blogs = res.locals.blogs.slice(start, end)

	res.locals.categories = categories
	res.locals.tags = tags
	res.render("index", {max: Math.ceil(max_page), current: page, min: 1})
}

controller.showDetails = async (req, res) => {
	let id = isNaN(req.params.id) ? 0 : parseInt(req.params.id)
	res.locals.blog = await models.Blog.findOne({
		attributes: ["id", "title", "description", "createdAt"],
		where: {id: id},
		include: [
			{model: models.Category},
			{model: models.User},
			{model: models.Tag},
			{model: models.Comment},
		],
	})

	const allBlogs = await models.Blog.findAll({
		attributes: ["id", "title", "imagePath", "summary", "createdAt"],
		include: [
			{model: models.Comment},
			{model: models.Category},
			{model: models.Tag},
		],
	})
	const info = req.query.info
	let filteredBlogs = []
	if (info != null) {
		filteredBlogs = await allBlogs.filter((model) => {
			return model.title.toLowerCase().includes(info.toLowerCase())
		})
	} else filteredBlogs = allBlogs

	const categories = await models.Category.findAll({
		attributes: ["name"],
		include: [{model: models.Blog}],
	})

	const category = req.query.category
	if (category != null) {
		filteredBlogs = await filteredBlogs.filter((model) => {
			return model.Category.name == category
		})
	}

	const tags = await models.Tag.findAll({
		attributes: ["name"],
	})

	const tag = req.query.tag
	if (tag != null) {
		filteredBlogs = await filteredBlogs.filter((model) => {
			const tagList = model.Tags
			let nameList = []
			tagList.forEach((tagInTags) => {
				nameList.push(tagInTags.name)
			})
			return nameList.includes(tag)
		})
	}

	res.locals.blogs = filteredBlogs
	res.locals.categories = categories
	res.locals.tags = tags

	res.render("details")
}

module.exports = controller
